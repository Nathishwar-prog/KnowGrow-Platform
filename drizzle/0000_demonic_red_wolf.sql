CREATE TABLE "achievements" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "achievements_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"achievementType" varchar(100) NOT NULL,
	"achievementName" varchar(255) NOT NULL,
	"description" varchar(500),
	"earnedAt" timestamp DEFAULT now() NOT NULL,
	"points" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "admins" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "admins_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(50) DEFAULT 'admin' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"lastLogin" timestamp,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "courses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cid" varchar(255) NOT NULL,
	"name" varchar(255),
	"description" varchar(1000),
	"noOfChapters" integer NOT NULL,
	"includeVideo" boolean DEFAULT false,
	"level" varchar(50) NOT NULL,
	"category" varchar(255),
	"courseJson" json,
	"bannerImageUrl" varchar(1024) DEFAULT '',
	"courseContent" json DEFAULT '{}'::json,
	"userEmail" varchar(255) NOT NULL,
	CONSTRAINT "courses_cid_unique" UNIQUE("cid")
);
--> statement-breakpoint
CREATE TABLE "enrollCourse" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "enrollCourse_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"cid" varchar(255),
	"userEmail" varchar(255) NOT NULL,
	"completedChapters" json
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "quizzes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"quizId" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" varchar(1000),
	"topic" varchar(255) NOT NULL,
	"difficulty" varchar(50) NOT NULL,
	"questionCount" integer NOT NULL,
	"quizData" json NOT NULL,
	"userEmail" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "quizzes_quizId_unique" UNIQUE("quizId")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"age" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"subscriptionId" varchar(64),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_userEmail_users_email_fk" FOREIGN KEY ("userEmail") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollCourse" ADD CONSTRAINT "enrollCourse_cid_courses_cid_fk" FOREIGN KEY ("cid") REFERENCES "public"."courses"("cid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enrollCourse" ADD CONSTRAINT "enrollCourse_userEmail_users_email_fk" FOREIGN KEY ("userEmail") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_userEmail_users_email_fk" FOREIGN KEY ("userEmail") REFERENCES "public"."users"("email") ON DELETE no action ON UPDATE no action;