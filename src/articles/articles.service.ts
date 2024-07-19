import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Article } from './article';
import { ArticleDto } from './article.dto';
// @ts-expect-error The lowdb library is an ESM library and this project is a CommonJS project
import type { Low } from 'lowdb';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ArticlesService {
  constructor(
    @Inject('DATABASE') private readonly database: Low<{ articles: Article[] }>,
  ) {}

  private isTitleAvailable(title: string, idToIgnore?: string) {
    const matchingArticle = this.database.data.articles.find((article) => {
      return article.title === title && article.id !== idToIgnore;
    });
    return matchingArticle === undefined;
  }

  getAll() {
    return this.database.data.articles;
  }

  getById(id: string) {
    const article = this.database.data.articles.find(
      (article) => article.id === id,
    );
    if (article) {
      return article;
    }
    throw new NotFoundException();
  }

  async update(id: string, article: ArticleDto) {
    const articleIndex = this.database.data.articles.findIndex(
      (article) => article.id === id,
    );
    if (articleIndex === -1) {
      throw new NotFoundException();
    }
    if (!this.isTitleAvailable(article.title, id)) {
      throw new ConflictException('Article with this title already exists');
    }
    this.database.data.articles[articleIndex] = {
      ...this.database.data.articles[articleIndex],
      title: article.title,
      content: article.content,
    };
    await this.database.write();
    return this.database.data.articles[articleIndex];
  }

  async create(article: ArticleDto) {
    if (!this.isTitleAvailable(article.title)) {
      throw new ConflictException('Article with this title already exists');
    }
    const newArticle: Article = {
      id: uuid(),
      title: article.title,
      content: article.content,
    };
    this.database.data.articles.push(newArticle);
    await this.database.write();
    return newArticle;
  }

  async delete(id: string) {
    const articleIndex = this.database.data.articles.findIndex(
      (article) => article.id === id,
    );
    if (articleIndex === -1) {
      throw new NotFoundException();
    }
    this.database.data.articles.splice(articleIndex, 1);
    await this.database.write();
  }
}
