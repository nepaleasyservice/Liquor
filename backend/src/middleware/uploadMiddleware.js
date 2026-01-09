// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp/")
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + "-" + uniqueSuffix)
//   }
// })
// const upload = multer({ storage });

// export default upload;


import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(), // ✅ no disk writes on vercel
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export default upload;
