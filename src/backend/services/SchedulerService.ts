import { NewsPipelineService } from './NewsPipelineService';
import { INewsRepository } from '../interfaces/INewsRepository';
import { SchedulerStatus } from '../types';

export class SchedulerService {
  private pipelineService: NewsPipelineService;
  private repository: INewsRepository;
  private intervalMinutes: number;
  private timer: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private lastRunTime: Date | null = null;
  private nextRunTime: Date | null = null;
  private totalRuns: number = 0;
  private totalArticlesCollected: number = 0;
  private totalDuplicatesDetected: number = 0;

  constructor(
    pipelineService: NewsPipelineService,
    repository: INewsRepository,
    intervalMinutes: number = 10
  ) {
    this.pipelineService = pipelineService;
    this.repository = repository;
    this.intervalMinutes = intervalMinutes;
  }

  public start(): void {
    if (this.isRunning) {
      console.log('[SchedulerService] Scheduler is already running.');
      return;
    }

    this.isRunning = true;
    const intervalMs = this.intervalMinutes * 60 * 1000;

    console.log(`[SchedulerService] Starting News Collection Scheduler (Interval: ${this.intervalMinutes} minutes)`);

    // Run initial cycle immediately
    this.executeCycle();

    // Set recurring timer
    this.timer = setInterval(() => {
      this.executeCycle();
    }, intervalMs);
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    this.nextRunTime = null;
    console.log('[SchedulerService] Scheduler stopped.');
  }

  public async triggerManualRun() {
    console.log('[SchedulerService] Manual pipeline run triggered via API');
    return await this.executeCycle();
  }

  private async executeCycle() {
    this.lastRunTime = new Date();
    this.nextRunTime = new Date(Date.now() + this.intervalMinutes * 60 * 1000);

    try {
      const runLog = await this.pipelineService.runPipeline();
      this.totalRuns++;
      this.totalArticlesCollected += runLog.rawCollected;
      this.totalDuplicatesDetected += runLog.duplicatesDetected;

      return runLog;
    } catch (err) {
      console.error('[SchedulerService] Error executing scheduled cycle:', err);
      throw err;
    }
  }

  public async getStatus(): Promise<SchedulerStatus> {
    const dbStatus = await this.repository.getDatabaseStatus();

    return {
      isRunning: this.isRunning,
      intervalMinutes: this.intervalMinutes,
      lastRunTime: this.lastRunTime ? this.lastRunTime.toISOString() : undefined,
      nextRunTime: this.nextRunTime ? this.nextRunTime.toISOString() : undefined,
      totalRuns: this.totalRuns,
      totalArticlesCollected: this.totalArticlesCollected,
      totalDuplicatesDetected: this.totalDuplicatesDetected,
      usingSupabase: dbStatus.type === 'supabase',
      supabaseUrlConfigured: Boolean(process.env.SUPABASE_URL)
    };
  }
}
