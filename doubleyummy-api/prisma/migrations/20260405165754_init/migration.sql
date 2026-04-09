-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dishes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500),
    "recipe_text" TEXT,
    "recipe_url" TEXT,
    "cuisine_type" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dish_media" (
    "id" TEXT NOT NULL,
    "dish_id" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dish_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dish_meal_types" (
    "dish_id" TEXT NOT NULL,
    "meal_type" TEXT NOT NULL,

    CONSTRAINT "dish_meal_types_pkey" PRIMARY KEY ("dish_id","meal_type")
);

-- CreateTable
CREATE TABLE "dish_tags" (
    "dish_id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "dish_tags_pkey" PRIMARY KEY ("dish_id","tag")
);

-- CreateTable
CREATE TABLE "swipe_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "meal_type" TEXT,
    "filters_json" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "swipe_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "swipe_votes" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "dish_id" TEXT NOT NULL,
    "vote" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "swipe_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shared_sessions" (
    "id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "recipient_id" TEXT,
    "share_code" VARCHAR(20) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "voted_at" TIMESTAMP(3),

    CONSTRAINT "shared_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_votes" (
    "id" TEXT NOT NULL,
    "shared_session_id" TEXT NOT NULL,
    "dish_id" TEXT NOT NULL,
    "vote" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "partner_votes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "swipe_votes_session_id_dish_id_key" ON "swipe_votes"("session_id", "dish_id");

-- CreateIndex
CREATE UNIQUE INDEX "shared_sessions_share_code_key" ON "shared_sessions"("share_code");

-- CreateIndex
CREATE UNIQUE INDEX "partner_votes_shared_session_id_dish_id_key" ON "partner_votes"("shared_session_id", "dish_id");

-- AddForeignKey
ALTER TABLE "dishes" ADD CONSTRAINT "dishes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dish_media" ADD CONSTRAINT "dish_media_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dish_meal_types" ADD CONSTRAINT "dish_meal_types_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dish_tags" ADD CONSTRAINT "dish_tags_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swipe_sessions" ADD CONSTRAINT "swipe_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swipe_votes" ADD CONSTRAINT "swipe_votes_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "swipe_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swipe_votes" ADD CONSTRAINT "swipe_votes_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_sessions" ADD CONSTRAINT "shared_sessions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "swipe_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_sessions" ADD CONSTRAINT "shared_sessions_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_sessions" ADD CONSTRAINT "shared_sessions_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_votes" ADD CONSTRAINT "partner_votes_shared_session_id_fkey" FOREIGN KEY ("shared_session_id") REFERENCES "shared_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_votes" ADD CONSTRAINT "partner_votes_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
