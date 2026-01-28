// src/db/schema.ts
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Tabla Tareas
export const tareas = sqliteTable('tareas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titulo: text('titulo').notNull(),
  realizada: integer('realizada', { mode: 'boolean' }).default(false),
});

// Tabla Partidas
export const partidas = sqliteTable('partidas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nick: text('nick').notNull(),
  numeroSecreto: integer('numero_secreto').notNull(),
  intentos: text('intentos').notNull(),
  // CAMBIO IMPORTANTE: Hemos quitado .default(new Date()) para evitar el error
  fecha: integer('fecha', { mode: 'timestamp' }), 
});