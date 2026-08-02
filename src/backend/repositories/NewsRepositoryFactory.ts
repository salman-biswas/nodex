import { INewsRepository } from '../interfaces/INewsRepository';
import { InMemoryNewsRepository } from './InMemoryNewsRepository';
import { SupabaseNewsRepository } from './SupabaseNewsRepository';

export class NewsRepositoryFactory {
  private static instance: INewsRepository | null = null;

  public static async getRepository(): Promise<INewsRepository> {
    if (!this.instance) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey && supabaseUrl.trim().length > 0) {
        console.log('[NewsRepositoryFactory] Creating SupabaseNewsRepository instance');
        const repo = new SupabaseNewsRepository(supabaseUrl, supabaseKey);
        await repo.initialize();
        this.instance = repo;
      } else {
        console.log('[NewsRepositoryFactory] SUPABASE_URL not set. Falling back to InMemoryNewsRepository');
        const repo = new InMemoryNewsRepository();
        await repo.initialize();
        this.instance = repo;
      }
    }
    return this.instance;
  }
}
