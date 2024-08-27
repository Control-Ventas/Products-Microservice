/* eslint-disable prettier/prettier */
import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to the database');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    })
  }

  findAll() {
    return this.product.findMany({
      where: { available: true }
    });
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { product_id: id, available: true }
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    let updatedProduct;
    try {
      updatedProduct = await this.product.update({
        where: { product_id: id },
        data: updateProductDto
      })
    } catch (e) {
      throw new NotFoundException(`Product #${id} not found`);
    }


    return updatedProduct;
  }

  async remove(id: number) {
    let product;

    try {
      product = await this.product.update({
        where: { product_id: id },
        data: { available: false }
      })
    } catch (e) {
      throw new NotFoundException(`Product #${id} not found`);
    }


    return product;
  }

  async restarStock(id: number, cantidad: number) {
    const product = await this.product.findUnique({
      where: { product_id: id }
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    if (product.stock < cantidad) {
      throw new NotFoundException(`The stock is not enough`);
    }

    const updatedProduct = await this.product.update({
      where: { product_id: id },
      data: { stock: product.stock - cantidad }
    })

    return updatedProduct;
  }

}
