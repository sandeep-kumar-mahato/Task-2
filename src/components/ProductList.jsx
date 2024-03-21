import { useEffect, useState } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [availableFields] = useState([
    "id",
    "subcategory",
    "title",
    "price",
    "popularity",
    "description",
    "rating",
    "UTM Source",
    "UTM Medium",
  ]);
  const [displayedFields, setDisplayedFields] = useState([
    "id",
    "subcategory",
    "title",
    "price",
  ]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://s3.amazonaws.com/open-to-cors/assignment.json"
      );
      const data = await response.json();

      const transformedData = Object.keys(data.products).map((key) => ({
        id: key,
        ...data.products[key],
      }));

      const sortedProducts = transformedData.sort(
        (a, b) => b.popularity - a.popularity
      );

      setProducts(sortedProducts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const moveFieldToDisplayed = (field) => {
    if (!displayedFields.includes(field)) {
      setDisplayedFields([...displayedFields, field]);

      // Find the product with the selected field
      const productWithField = products.find(
        (product) => product[field] !== undefined
      );

      if (productWithField) {
        // Add the product with the selected field to displayedData
        setDisplayedData([
          ...displayedData,
          { id: productWithField.id, [field]: productWithField[field] },
        ]);
      }
    }
  };

  const moveFieldToAvailable = (field) => {
    setDisplayedFields(displayedFields.filter((f) => f !== field));
  };

  const handleNext = () => {
    const filteredData = products.map((product) =>
      Object.fromEntries(
        Object.entries(product).filter(([key]) => displayedFields.includes(key))
      )
    );

    setDisplayedData(filteredData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-normal my-4">Import Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* File Selection Card */}
        <div className="flex justify-start border rounded-md shadow p-4">
          <h2 className="mb-4">Step 1:</h2>
          <div className="w-4/5 px-4">
            <h2 className="mb-4">Select File</h2>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-2/3">
                    <input
                      type="file"
                      id="file"
                      name="file"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p className="text-xs mt-2">
                      Supported File Type(s): CSV, JSON
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* File Formatting Card */}
        <div className="flex justify-start border rounded-md shadow p-4">
          <h2 className="mb-4">Step 2:</h2>
          <div className="w-4/5 px-4">
            <h2 className="mb-4">Specify Format</h2>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="w-1/3">
                    <label className="mr-2">File Type:</label>
                  </td>
                  <td className="w-2/3">
                    <select className="w-full p-2 border rounded">
                      <option>csv</option>
                      <option>json</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="w-1/3">
                    <label className="mr-2">Character Encoding:</label>
                  </td>
                  <td className="w-2/3">
                    <select className="w-full p-2 border rounded">
                      <option>UTF-8</option>
                      <option>UTF-16BE</option>
                      <option>UTF-32BE</option>
                      <option>UTF-16LE</option>
                      <option>UTF-32LE</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="w-1/3">
                    <label className="mr-2">Delimiter:</label>
                  </td>
                  <td className="w-2/3">
                    <select className="w-full p-2 border rounded">
                      <option>comma</option>
                      <option>Tab</option>
                      <option>Space</option>
                      <option>Semicolon</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td className="w-1/3">
                    <label className="mr-2">Has Header:</label>
                  </td>
                  <td className="w-2/3">
                    <input type="checkbox" className="mr-2" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Display Handling */}
      <div className="flex justify-start border rounded-md shadow p-4 mt-4">
        <h2 className="mb-4">Step 3:</h2>
        <div className="w-4/5 px-4">
          <h2 className="mb-4">Display Handling</h2>
          <h2 className="mb-4">Select the fields to be displayed</h2>
          <div className="flex space-x-4">
            <div className="w-1/2 border rounded-md shadow p-4">
              <p className="font-medium">Available Fields</p>
              <ul>
                {availableFields.map((field) => (
                  <li key={field}>
                    {field}{" "}
                    <button
                      onClick={() => moveFieldToDisplayed(field)}
                      className="text-blue-500 hover:underline"
                    >
                      Select
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-1/2 border rounded-md shadow p-4">
              <p className="font-medium">Fields to be Displayed</p>
              <ul>
                {displayedFields.map((field) => (
                  <li key={field}>
                    {field}{" "}
                    <button
                      onClick={() => moveFieldToAvailable(field)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
              onClick={handleNext}
            >
              Next
            </button>
            <button className="text-gray-500 hover:underline">Cancel</button>
          </div>
        </div>
      </div>

      {/* Display Table */}
      {displayedData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg mb-4">Displayed Data</h2>
          <table className="min-w-full divide-y divide-gray-200 border rounded-md shadow p-4">
            <thead className="bg-gray-50">
              <tr>
                {displayedFields.map((field) => (
                  <th
                    key={field}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {field}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedData.map((item, index) => (
                <tr key={index}>
                  {displayedFields.map((field) => (
                    <td
                      key={`${field}-${index}`}
                      className="px-6 py-4 whitespace-nowrap"
                    >
                      {item[field]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductList;
