import { useRef } from "react";
// import * as XLSX from "xlsx";

export default function BulkUpload() {
  <div></div>;
}
// const { seller } = useSelector((state) => state.seller);
// const { loading } = useSelector((state) => state.product);
// const fileInputRef = useRef(null);
// const [selectedFile, setSelectedFile] = useState(null);
// const [errMsg, setErrMsg] = useState("");
// const [processedData, setProcessedData] = useState(null);
// // const dispatch = useDispatch();

//   function handleFileUpload(event) {
//     const file = event.target.files[0];

//     if (file) {
//       const fileReader = new FileReader();
//       fileReader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         processFileData(data, file);
//       };

//       fileReader.readAsArrayBuffer(file);
//     }
//   }

//   function processFileData(data, file) {
//     const workbook = XLSX.read(data, { type: "array" });
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const sheetData = XLSX.utils
//       .sheet_to_json(sheet, { header: 1 })
//       .filter((row) => row.length > 0);

//     const columns = sheetData[0].map((column) =>
//       removeBracketSection(column.toLowerCase())
//     );
//     const requiredColumns = [
//       "title",
//       "category",
//       "subcategory",
//       "mrp",
//       "moq",
//       "sp",
//       "description",
//       "size",
//       "dod",
//       "material",
//     ];

//     const missingColumns = getMissingColumns(columns, requiredColumns);
//     // console.log("Missing columns: ", missingColumns);

//     if (missingColumns.length > 0) {
//       handleErrorMessage(
//         `The following columns are missing: ${missingColumns.join(", ")}`
//       );
//       return;
//     }

//     const missingDataColumns = getMissingDataColumns(
//       sheetData,
//       columns,
//       requiredColumns
//     );
//     // console.log("Missing Data columns: ", missingDataColumns);

//     if (missingDataColumns.length > 0) {
//       handleErrorMessage(
//         `The following columns have no data: ${missingDataColumns.join(", ")}`
//       );
//       return;
//     }

//     const numberValidationResult = validateNumberFields(sheetData, columns);
//     // console.log("Number validation result: ", numberValidationResult);

//     if (!numberValidationResult.isValid) {
//       handleErrorMessage(
//         `Invalid number values found in '${numberValidationResult.invalidColumn}' column!`
//       );
//       return;
//     }

//     const categoryIndex = columns.findIndex((col) => col === "category");
//     const subcategoryIndex = columns.findIndex((col) => col === "subcategory");
//     const categoryData = getColumnData(sheetData, categoryIndex);
//     // console.log("Category data: ", categoryData);
//     const subcategoryData = getColumnData(sheetData, subcategoryIndex);
//     // console.log("subcategoryData: ", subcategoryData);
//     const sellerCategories = [
//       seller?.category1,
//       seller?.category2,
//       seller?.category3,
//     ].filter((category) => category !== undefined);

//     const invalidCategories = getInvalidCategories(
//       categoryData,
//       sellerCategories
//     );

//     // console.log("invalidCategories: ", invalidCategories);
//     if (invalidCategories.length > 0) {
//       handleErrorMessage(
//         `Invalid categories found: ${invalidCategories.join(", ")}`
//       );
//       return;
//     }

//     const invalidSubcategories = getInvalidSubcategories(
//       categoryData,
//       subcategoryData,
//       subcategories
//     );
//     // console.log("invalidSubcategories: ", invalidSubcategories);

//     if (invalidSubcategories.length > 0) {
//       handleErrorMessage(
//         `Invalid subcategories found: ${invalidSubcategories.join(", ")}`
//       );
//       return;
//     }

//     setSelectedFile(file);
//   }

//   function handleErrorMessage(errorMessage) {
//     setErrMsg(errorMessage);
//     fileInputRef.current.value = null;
//     setSelectedFile(null);
//   }

//   function processSheetData(sheetData) {
//     return sheetData.slice(1).map((row) =>
//       row.reduce((acc, value, index) => {
//         const column = removeBracketSection(sheetData[0][index].toLowerCase());
//         if (column === "category") {
//           value = value.replace(/_/g, " ");
//         }
//         if (column === "subcategory") {
//           value = addHyphensAndLowercase(value);
//         }
//         return {
//           ...acc,
//           [column]: value || 0,
//         };
//       }, {})
//     );
//   }

//   function handleRemoveFile() {
//     setSelectedFile(null);
//   }

//   function handleNext() {
//     if (!selectedFile) return;

//     const fileReader = new FileReader();
//     fileReader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: "array" });

//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       const sheetData = XLSX.utils
//         .sheet_to_json(sheet, { header: 1 })
//         .filter((row) => row.length > 0);

//       const processedData = processSheetData(sheetData);
//       setProcessedData(processedData);
//     };

//     fileReader.readAsArrayBuffer(selectedFile);
//   }

//   function handleProductsUpload() {
//     if (processedData) {
//       const products = processedData.map((row) => {
//         return {
//           title: row["title"],
//           category: row["category"],
//           subcategory: row["subcategory"],
//           size: row["size"],
//           mrp: row["mrp"],
//           warranty: row["warranty"] || 0,
//           moq: row["moq"],
//           sp: row["sp"],
//           description: row["description"],
//           dod: row["dod"],
//           material: row["material"],
//         };
//       });

//       dispatch(bulkProductUpload(products)).then(() => {
//         toggleModal();
//       });
//     }
//   }

//   function handleCancelUpload() {
//     toggleModal();
//     setProcessedData(null);
//   }

//   useEffect(() => {
//     if (errMsg) {
//       setTimeout(() => {
//         setErrMsg("");
//       }, 5000);
//     }
//   }, [errMsg]);

//   return (
//     <>
//       {processedData ? (
//         <ProductPreview
//           processedData={processedData}
//           loading={loading}
//           handleProductsUpload={handleProductsUpload}
//           handleCancelUpload={handleCancelUpload}
//         />
//       ) : (
//         <UploaderSection
//           selectedFile={selectedFile}
//           handleRemoveFile={handleRemoveFile}
//           errMsg={errMsg}
//           handleNext={handleNext}
//           handleFileUpload={handleFileUpload}
//           fileInputRef={fileInputRef}
//         />
//       )}
//     </>
//   );
// }

// function UploaderSection({
//   selectedFile,
//   handleRemoveFile,
//   errMsg,
//   handleNext,
//   handleFileUpload,
//   fileInputRef,
// }) {
//   return (
//     <div>
//       <div className={`${cls.uploadForm}`}>
//         <div className={cls.uploadFormLeft}>
//           <SiMicrosoftexcel className={cls.excelIcon} />
//         </div>
//         <div className={cls.uploadFormRight}>
//           <p>Bulk Product Upload</p>
//           <span>
//             You can upload the products in bulk through excel sheet or create
//             single product
//           </span>
//         </div>
//       </div>
//       <div className={cls.uploadSec}>
//         <label htmlFor="file-upload" className={cls.customInputLabel}>
//           <MdUpload className={cls.uploadIcon} /> Upload File
//         </label>
//         <input
//           id="file-upload"
//           style={{ display: "none" }}
//           type="file"
//           accept=".xlsx, .xls"
//           onChange={handleFileUpload}
//           ref={fileInputRef}
//         />
//         {selectedFile && (
//           <div className={cls.uploaderFileContainer}>
//             <div className={cls.selectedFile}>
//               <SiMicrosoftexcel className={cls.fileIcon} />
//               <li>{selectedFile.name}</li>
//               <TiDelete
//                 className={`${cls.crossIcon} ${cls.cancelFileIcon}`}
//                 onClick={handleRemoveFile}
//               />
//             </div>
//           </div>
//         )}
//         {errMsg && (
//           <div className={cls.errMsg}>
//             <BiErrorCircle className={cls.errIcon} />
//             <p>{errMsg}</p>
//           </div>
//         )}
//         <button
//           type="button"
//           disabled={!selectedFile}
//           onClick={handleNext}
//           className={selectedFile ? cls.enabled : cls.disabled}
//         >
//           NEXT
//         </button>
//       </div>
//     </div>
//   );
// }

// function ProductPreview({
//   processedData,
//   loading,
//   handleProductsUpload,
//   handleCancelUpload,
// }) {
//   return (
//     <div>
//       <div className={cls.fileContainer}>
//         {processedData && (
//           <table border="1">
//             <thead>
//               <tr>
//                 <th>Title</th>
//                 <th>Category</th>
//                 <th>Subcategory</th>
//                 <th>Size</th>
//                 <th>MRP</th>
//                 <th>MOQ</th>
//                 <th>SP</th>
//                 <th>Warranty</th>
//                 <th>Description</th>
//                 <th>DOD</th>
//                 <th>Material</th>
//               </tr>
//             </thead>
//             <tbody>
//               {processedData.map((row, index) => (
//                 <tr key={index}>
//                   <td>{row["title"]}</td>
//                   <td>{row["category"]}</td>
//                   <td>{removeHyphensAndTitleCase(row["subcategory"])}</td>
//                   <td>{row["size"]}</td>
//                   <td>{row["mrp"]}</td>
//                   <td>{row["moq"]}</td>
//                   <td>{row["sp"]}</td>
//                   <td>{row["warranty"] || 0}</td>
//                   <td>{row["description"]}</td>
//                   <td>{row["dod"]}</td>
//                   <td>{row["material"]}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//       <div className={cls.confirmationButtons}>
//         <button className="button-secondary" onClick={handleCancelUpload}>
//           Cancel
//         </button>
//         <button
//           className="button-primary"
//           onClick={handleProductsUpload}
//           disabled={loading}
//         >
//           {loading ? "Uploading..." : "Upload"}
//         </button>
//       </div>
//     </div>
//   );
// }

// function getMissingColumns(columns, requiredColumns) {
//   return requiredColumns.filter((col) => !columns.includes(col));
// }

// function getMissingDataColumns(sheetData, columns, requiredColumns) {
//   return requiredColumns.filter((col) => {
//     const columnIndex = columns.findIndex((c) => c === col);
//     const columnData = getColumnData(sheetData, columnIndex);
//     return columnData.slice(1).every((entry) => !entry);
//   });
// }

// function validateNumberFields(sheetData, columns) {
//   const numericColumns = ["mrp", "moq", "sp", "dod"];
//   const numericIndices = numericColumns.map((col) =>
//     columns.findIndex((c) => c === col.toLowerCase())
//   );

//   for (let i = 1; i < sheetData.length; i++) {
//     for (const index of numericIndices) {
//       const value = parseInt(sheetData[i][index]);
//       if (isNaN(value) || typeof value !== "number") {
//         return { isValid: false, invalidColumn: columns[index] };
//       }
//     }
//   }

//   return { isValid: true, invalidColumn: null };
// }

// function getColumnData(sheetData, columnIndex) {
//   return sheetData.slice(1).map((row) => row[columnIndex]);
// }

// function getInvalidCategories(categoryData, sellerCategories) {
//   return categoryData.filter((category) => {
//     const formattedCategory = category.replace(/_/g, " ");
//     return !sellerCategories.includes(formattedCategory);
//   });
// }

// function getInvalidSubcategories(categoryData, subcategoryData, subcategories) {
//   return subcategoryData.filter((subcategory, index) => {
//     const category = categoryData[index].replace(/_/g, " ");
//     const validSubcategories = subcategories[category];
//     return !validSubcategories || !validSubcategories.includes(subcategory);
//   });
// }
