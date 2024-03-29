import { Schema, SchemaTypes } from "mongoose";
import generateUUID from "uuid/v4";

/**
 * Removes _id field in subdocuments and allows virtual fields to be returned
 */
export const readMapper = {
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc: any, ret: any, options: any) => {
      delete ret._id;
      if (ret.password) delete ret.password;
      if (ret.BVN) delete ret.BVN;
      return ret;
    }
  }
};

/**
 * Defines timestamps fields in a schema
 */
export const timestamps = {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
};

/**
 * Defines a schema type with a lowercased trimmed string
 */
export const trimmedLowercaseString = {
  type: SchemaTypes.String,
  trim: true,
  lowercase: true
};

/**
 * Defines a schema type with a trimmed string
 */
export const trimmedString = {
  type: SchemaTypes.String,
  trim: true
};

/**
 * Defines a schema type with a lowercased string
 */
export const lowercaseString = {
  type: SchemaTypes.String,
  lowercase: true
};

/**
 * Creates a unique index for a document taking into account support
 * for soft deletes
 * @param schema Schema of Document
 * @param props properties to be part of unique index
 */
export function uniqueIndex(schema: Schema, ...props: string[]) {
  const indexes = props.reduce(
    (idx, k) => {
      idx[k] = 1;
      return idx;
    },
    { deleted_at: 1 }
  );
  schema.index(indexes, { unique: true });
  return schema;
}

/**
 * Changes default mongodb objectid to guuid
 */
export const uuid = {
  type: SchemaTypes.String,
  default: generateUUID
};
