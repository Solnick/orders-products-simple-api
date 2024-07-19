import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Article } from './article';
import { ArticleDto } from './article.dto';

@Injectable()
export class ArticlesService {
  private nextCreatedArticleId = 1;
  private articles: Article[] = [];

  private isTitleAvailable(title: string) {
    const matchingArticle = this.articles.find(
      (article) => article.title === title,
    );
    return matchingArticle === undefined;
  }

  getAll() {
    return this.articles;
  }

  getById(id: number) {
    const article = this.articles.find((article) => article.id === id);
    if (article) {
      return article;
    }
    throw new NotFoundException();
  }

  update(id: number, article: ArticleDto) {
    const articleIndex = this.articles.findIndex(
      (article) => article.id === id,
    );
    if (articleIndex === -1) {
      throw new NotFoundException();
    }
    if (!this.isTitleAvailable(article.title)) {
      throw new ConflictException('Article with this title already exists');
    }
    this.articles[articleIndex] = {
      ...this.articles[articleIndex],
      title: article.title,
      content: article.content,
    };
    return this.articles[articleIndex];
  }

  create(article: ArticleDto) {
    if (!this.isTitleAvailable(article.title)) {
      throw new ConflictException('Article with this title already exists');
    }
    const newArticle: Article = {
      id: this.nextCreatedArticleId++,
      title: article.title,
      content: article.content,
    };
    this.articles.push(newArticle);
    return newArticle;
  }

  delete(id: number) {
    const articleIndex = this.articles.findIndex(
      (article) => article.id === id,
    );
    if (articleIndex === -1) {
      throw new NotFoundException();
    }
    this.articles.splice(articleIndex, 1);
  }
}
