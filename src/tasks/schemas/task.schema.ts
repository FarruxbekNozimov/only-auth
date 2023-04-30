import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true })
  task: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true, default: false })
  is_checked: boolean;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
