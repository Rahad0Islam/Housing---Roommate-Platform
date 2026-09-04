// import { Role } from "../../generated/prisma/enums";
// import config from "../config";
// import { prisma } from "../lib/prisma";
// import bcrypt from "bcryptjs";

// export const seedSuperAdmin = async () => {
//   try {
//     const superAdmin = await prisma.user.findFirst({
//         where : {
//             role : Role.SUPER_ADMIN
//         }
//     });

//     if(superAdmin) {
//         console.log("Super admin already exists.");
//         return;
//     }

//     const name = config.super_admin_name
//     const email = config.super_admin_email
//     const password = config.super_admin_password; // You should hash this password before storing it in the database

//     if (!name || !email || !password) {
//       console.error("Super admin credentials are not set in the environment variables.");
//       return;
//     }
//     const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

//     if (!superAdmin) {
//       await prisma.user.create({
//         data: {
//           email,
//           name,
//           password: hashedPassword,
//           role: Role.SUPER_ADMIN,
//           needPasswordChange: false,
//           emailVerified: true,
//         },
//       });
//     }
//   } catch (error) {
//     console.error("Error seeding super admin:", error);
//     await prisma.user.delete({
//         where: {
//             email: config.super_admin_email
//         }
//     })
//   }
// };




// //make patient seed

// export const seedPatient = async () => {
//   try {
//     const patient = await prisma.user.findUnique({
//         where : {
//            email : config.tester_patient_email
//         }
//     });

//     if(patient) {
//         console.log("Patient already exists.");
//         return;
//     }

//     const name = config.tester_patient_name
//     const email = config.tester_patient_email
//     const password = config.tester_patient_password; // You should hash this password before storing it in the database

//     if (!name || !email || !password) {
//       console.error("Patient credentials are not set in the environment variables.");
//       return;
//     }
//     const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

//     if (!patient) {
//       await prisma.user.create({
//         data: {
//           email,
//           name,
//           password: hashedPassword,
//           role: Role.PATIENT,
//           needPasswordChange: false,
//           emailVerified: true,
//         },
//       });
//     }
//   } catch (error) {
//     console.error("Error seeding patient:", error);
//     await prisma.user.delete({
//         where: {
//             email: config.tester_patient_email
//         }
//     })
//   }
// };


// // make doctor seed
// export const seedDoctor = async () => {
//   try {
//     const doctor = await prisma.user.findUnique({
//         where : {
//            email : config.tester_doctor_email
//         }
//     });

//     if(doctor) {
//         console.log("Doctor already exists.");
//         return;
//     }

//     const name = config.tester_doctor_name
//     const email = config.tester_doctor_email
//     const password = config.tester_doctor_password; // You should hash this password before storing it in the database

//     if (!name || !email || !password) {
//       console.error("Doctor credentials are not set in the environment variables.");
//       return;
//     }
//     const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

//     if (!doctor) {
//       await prisma.user.create({
//         data: {
//           email,
//           name,
//           password: hashedPassword,
//           role: Role.DOCTOR,
//           needPasswordChange: false,
//           emailVerified: true,
//           doctors: {
//             create: {
//               specialization: "General Practitioner",
//               verificationStatus: "APPROVED",
//               email,
//               name,
//               experienceYears: 5,
//               contactNumber: "1234567890",
//               address: "123 Main St, City, Country",
//               bio: "Experienced general practitioner with a passion for patient care.",
//               licenseNumber: "DOC123456",
//               qualifications: "MBBS, MD",
//               consultationFee: 50.00,

//             }
//           }
//         },
//       });
//     }
//   } catch (error) {
//     console.error("Error seeding doctor:", error);
//     await prisma.user.delete({
//         where: {
//             email: config.tester_doctor_email
//         }
//     })
//   }
// };