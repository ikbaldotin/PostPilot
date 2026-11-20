-- CreateTable
CREATE TABLE "InstagramAccount" (
    "id" UUID NOT NULL,
    "instagramUserId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "accessTokenEncrypted" TEXT NOT NULL,
    "tokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstagramAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InstagramAccount_instagramUserId_key" ON "InstagramAccount"("instagramUserId");

-- CreateIndex
CREATE UNIQUE INDEX "InstagramAccount_userId_key" ON "InstagramAccount"("userId");

-- AddForeignKey
ALTER TABLE "InstagramAccount" ADD CONSTRAINT "InstagramAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
