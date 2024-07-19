import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import ArticlesController from './articles.controller';
import { Article } from './article';
import { v4 as uuid } from 'uuid';

@Module({
  imports: [],
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    {
      provide: 'DATABASE',
      useFactory: async () => {
        const { JSONFilePreset } = await import('lowdb/node');

        const initialArticles: Article[] = [
          {
            id: uuid(),
            title: 'My first article',
            content: 'Hello!',
          },
          {
            id: uuid(),
            title: 'My second article',
            content: 'Hi!',
          },
        ];

        return JSONFilePreset('db.json', {
          articles: initialArticles,
        });
      },
    },
  ],
})
export class ArticlesModule {}
