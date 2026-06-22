-- CreateTable
CREATE TABLE "streams" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "user_id" TEXT,
    "ingress_id" TEXT,
    "server_url" TEXT,
    "stream_key" TEXT,
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "isChatEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isChatFollowersOnly" BOOLEAN NOT NULL DEFAULT false,
    "isChatPremiumFollowersOnly" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "streams_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "streams_user_id_key" ON "streams"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "streams_ingress_id_key" ON "streams"("ingress_id");

-- AddForeignKey
ALTER TABLE "streams" ADD CONSTRAINT "streams_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
