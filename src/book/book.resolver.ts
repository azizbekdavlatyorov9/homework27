import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Book } from "./entities/book.entity";
import { BookService } from "./book.service";
import { CreateBookInput } from "./dto/create-book.input";
import { UpdateBookInput } from "./dto/update-book.input";
import { DeleteBookCount } from "./dto/delete-cound-dto";

@Resolver(() => Book)
export class BookResolver {
  constructor(private bookService: BookService) {}

  @Query(() => [Book])
  findAll() {
    return this.bookService.findAll();
  }

  @Mutation(() => Book)
  create(@Args("createBookInput") createBookDto: CreateBookInput) {
    return this.bookService.create(createBookDto);
  }

  @Query(() => Book)
  findOne(@Args("id", ({type: () => Int})) id: number) {
    return this.bookService.findOne(id);
  }
  @Mutation(() => Book)
  update(@Args("updateBookInput") updateBookInput: UpdateBookInput, @Args("id") id:number) {
    return this.bookService.update(id, updateBookInput);
  }

  @Mutation(() => DeleteBookCount)
  remove( @Args("id") id:number) {
    return this.bookService.remove(id);
  }

}
