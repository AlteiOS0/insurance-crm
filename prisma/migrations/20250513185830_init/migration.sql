-- CreateEnum
CREATE TYPE "insurance_product_type" AS ENUM ('investment_insurance', 'insurance_savings_plan');

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "surname" TEXT,
    "email" TEXT,
    "phone_number" TEXT NOT NULL,
    "inn" TEXT NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passports" (
    "id" SERIAL NOT NULL,
    "seria" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "place_of_birth" TEXT NOT NULL,
    "issued_by_whom" TEXT NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL,
    "department_code" TEXT NOT NULL,
    "client_id" INTEGER NOT NULL,

    CONSTRAINT "passports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registration_addresses" (
    "id" SERIAL NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "house" TEXT NOT NULL,
    "apartment" TEXT,
    "registered_at" TIMESTAMP(3) NOT NULL,
    "passportId" INTEGER NOT NULL,

    CONSTRAINT "registration_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "residential_addresses" (
    "id" SERIAL NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "house" TEXT NOT NULL,
    "apartment" TEXT,
    "passportId" INTEGER NOT NULL,

    CONSTRAINT "residential_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policies" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "issued_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "insurance_premium" DECIMAL(65,30) NOT NULL,
    "coverage" DECIMAL(65,30) NOT NULL,
    "policyPath" TEXT,
    "insured_person_id" INTEGER NOT NULL,
    "insurance_product_id" INTEGER NOT NULL,

    CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policies_number_reserved" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "uuid" UUID NOT NULL,

    CONSTRAINT "policies_number_reserved_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "insurance_product_type" NOT NULL,
    "min_age" INTEGER NOT NULL,
    "max_age" INTEGER NOT NULL,
    "min_insurance_premium" DECIMAL(65,30) NOT NULL,
    "max_insurance_premium" DECIMAL(65,30) NOT NULL,
    "min_coverage" DECIMAL(65,30) NOT NULL,
    "max_coverage" DECIMAL(65,30) NOT NULL,
    "min_how_years" DECIMAL(65,30) NOT NULL,
    "max_how_years" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "insurance_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "surname" TEXT,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "ipv4" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "refresh_token" UUID NOT NULL,
    "employee_id" INTEGER NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clients_email_key" ON "clients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_phone_number_key" ON "clients"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "clients_inn_key" ON "clients"("inn");

-- CreateIndex
CREATE UNIQUE INDEX "passports_client_id_key" ON "passports"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "registration_addresses_passportId_key" ON "registration_addresses"("passportId");

-- CreateIndex
CREATE UNIQUE INDEX "residential_addresses_passportId_key" ON "residential_addresses"("passportId");

-- CreateIndex
CREATE UNIQUE INDEX "policies_number_key" ON "policies"("number");

-- CreateIndex
CREATE UNIQUE INDEX "policies_number_reserved_number_key" ON "policies_number_reserved"("number");

-- CreateIndex
CREATE UNIQUE INDEX "employees_login_key" ON "employees"("login");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_refresh_token_key" ON "sessions"("refresh_token");

-- AddForeignKey
ALTER TABLE "passports" ADD CONSTRAINT "passports_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registration_addresses" ADD CONSTRAINT "registration_addresses_passportId_fkey" FOREIGN KEY ("passportId") REFERENCES "passports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "residential_addresses" ADD CONSTRAINT "residential_addresses_passportId_fkey" FOREIGN KEY ("passportId") REFERENCES "passports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_insured_person_id_fkey" FOREIGN KEY ("insured_person_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_insurance_product_id_fkey" FOREIGN KEY ("insurance_product_id") REFERENCES "insurance_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
