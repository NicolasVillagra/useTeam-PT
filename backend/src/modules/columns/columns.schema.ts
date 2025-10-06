import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Column extends Document {
  @Prop({ required: true })
  name: string;
}

export const ColumnSchema = SchemaFactory.createForClass(Column);
