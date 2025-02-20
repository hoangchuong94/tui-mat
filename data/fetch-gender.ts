import prisma from "@/lib/prisma";

export const fetchGender = () => {
  try {
    const genders = prisma.gender.findMany();
    return genders;
  } catch (error) {
    console.log(error);
    throw Error("An error occurred during the database connection");
  }
};
