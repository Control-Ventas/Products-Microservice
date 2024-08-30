/* eslint-disable prettier/prettier */
import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from 'rxjs';
import { RestarStockDto } from './dto/restarStock.dto';
import { RpcException } from '@nestjs/microservices';

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
      throw new RpcException(`Product #${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const {product_id: _, ...data} = updateProductDto;

    let updatedProduct;
    try {
      updatedProduct = await this.product.update({
        where: { product_id: id, available: true },
        data: data
      })
    } catch (e) {
      throw new RpcException(`Product #${id} not found`);
    }


    return updatedProduct;
  }



  async remove(id: number) {
    let product;

    try {
      product = await this.product.update({
        where: { product_id: id, available: true },
        data: { available: false }
      })
    } catch (e) {
      throw new RpcException(`Product #${id} not found`);
    }


    return product;
  }

  async restarStock(restarStockDto: RestarStockDto) {
    const product = await this.product.findUnique({
      where: { product_id: restarStockDto.product_id }
    });

    if (!product) {
      throw new RpcException(`Product #${restarStockDto.product_id} not found`);
    }

    if (product.stock < restarStockDto.cantidad) {
      throw new RpcException(`The stock is not enough`);
    }

    const updatedProduct = await this.product.update({
      where: { product_id: restarStockDto.product_id },
      data: { stock: product.stock - restarStockDto.cantidad }
    })

    return updatedProduct;
  }

  async validateProducts(ids: number[]){

    ids = Array.from(new Set(ids))

    const products = await this.product.findMany({
      where: { 
        product_id: {
          in: ids
        }
       }
    });

    if (products.length !== ids.length) {
      throw new RpcException(`Some products were not found`);
    }

    return products;

  }

}
