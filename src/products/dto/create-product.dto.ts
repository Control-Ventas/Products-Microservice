/* eslint-disable prettier/prettier */
import { Type } from "class-transformer";
import { IsNumber,Min, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    product_name: string;

    @IsString()
    description: string;

    @IsNumber({
        maxDecimalPlaces: 2,
    })
    @Min(0)
    @Type(() => Number)
    price: number;

    @IsNumber({
        maxDecimalPlaces: 0,
    })
    @Min(0)
    @Type(() => Number)
    stock: number;
}
