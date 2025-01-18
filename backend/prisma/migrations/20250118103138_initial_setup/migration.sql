-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "birthDate" DATE,
    "bloodType" VARCHAR(2),
    "postalCode" VARCHAR(7),
    "prefecture" VARCHAR(10),
    "city" VARCHAR(50),
    "streetAddress" VARCHAR(50),
    "buildingName" VARCHAR(100),
    "profileImageUrl" VARCHAR(255),
    "emergencyContact" VARCHAR(15),
    "emergencyContactName" VARCHAR(100),
    "profileMessage" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostalCode" (
    "id" SERIAL NOT NULL,
    "postalCode" VARCHAR(7) NOT NULL,
    "prefecture" VARCHAR(10) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "street" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PostalCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PostalCode_postalCode_key" ON "PostalCode"("postalCode");

-- CreateIndex
CREATE INDEX "PostalCode_postalCode_idx" ON "PostalCode"("postalCode");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
