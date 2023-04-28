import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  user_photo: string;

  @Prop({ required: true, default: false })
  is_admin: boolean;

  @Prop()
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
