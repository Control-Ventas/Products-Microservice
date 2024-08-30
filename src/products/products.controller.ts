/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RestarStockDto } from './dto/restarStock.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //@Post()
  @MessagePattern({cmd: 'createProduct'})
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  //@Get()
  @MessagePattern({cmd: 'findAllProducts'})
  findAll() {
    return this.productsService.findAll();
  }

  //@Get(':id')
  @MessagePattern({cmd: 'findOneProduct'})
  findOne(@Payload('id', ParseIntPipe) id: number) { //{id:1}
    return this.productsService.findOne(id);
  }

  //@Patch(':id')
  @MessagePattern({cmd: 'updateProduct'})
  update(
    //@Param('id') id: string, 
    //@Body() updateProductDto: UpdateProductDto
    @Payload() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(updateProductDto.product_id, updateProductDto);
  }

  //@Patch("restar_stock/:id")
  @MessagePattern({cmd: 'restarStock'})
  async crestarStock(
    //@Param('id') id: number,
   // @Query('cantidad') cantidad: number
   @Payload() restarStockDto :RestarStockDto
  ){
    return this.productsService.restarStock(restarStockDto)
  }

  //@Delete(':id')
  @MessagePattern({cmd: 'deleteProduct'})
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @MessagePattern({cmd: 'validateProducts'})
  validateProducts(@Payload() ids: number[]){
    return this.productsService.validateProducts(ids)
  }

  


}
