import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document, ObjectId, SchemaTypes } from "mongoose";

@Schema({versionKey: false})
export class Avatar extends Document {


  @Prop({ required: true })
  avatar: string;
  @Prop({ required: true })
  userId: string;

  @Prop()
  avatarHash: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);