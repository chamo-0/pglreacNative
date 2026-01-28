CREATE TABLE `partidas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`nick` text NOT NULL,
	`numero_secreto` integer NOT NULL,
	`intentos` text NOT NULL,
	`fecha` integer
);
--> statement-breakpoint
CREATE TABLE `tareas` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`titulo` text NOT NULL,
	`realizada` integer DEFAULT false
);
