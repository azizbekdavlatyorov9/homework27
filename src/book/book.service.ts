import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateBookInput } from "./dto/create-book.input";
import { UpdateBookInput } from "./dto/update-book.input";
import { InjectRepository } from "@nestjs/typeorm";
import { Book } from "./entities/book.entity";
import { Repository } from "typeorm";

@Injectable()
export class BookService {
  constructor(@InjectRepository(Book) private bookRepo: Repository<Book>) {}
  create(createBookInput: CreateBookInput) {
    const book = this.bookRepo.create(createBookInput);
    return this.bookRepo.save(book);
  }

  async findAll(): Promise<Book[]> {
    return await this.bookRepo.find();
  }

  async findOne(id: number) {
    const book = this.bookRepo.findOne({ where: { id } });

    if (!book) throw new NotFoundException("Book not found");
    return book;
  }

  async update(id: number, updateBookInput: UpdateBookInput) {
    const book = this.bookRepo.findOne({ where: { id } });

    if (!book) throw new NotFoundException("Book not found");
    await this.bookRepo.update(id, updateBookInput);
    return await this.bookRepo.findOne({ where: { id } });
  }

  async remove(id: number) {
    const book = this.bookRepo.findOne({ where: { id } });

    if (!book) throw new NotFoundException("Book not found");

    const result = await this.bookRepo.delete(id)
    return {deleteCount:result.affected ?? 0}
  }
}
