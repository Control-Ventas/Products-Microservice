import { IsNumber, IsPort, IsPositive } from "class-validator";


export class RestarStockDto {
    @IsNumber()
    @IsPositive()
    product_id: number;

    @IsNumber()
    @IsPositive()
    cantidad: number;
}