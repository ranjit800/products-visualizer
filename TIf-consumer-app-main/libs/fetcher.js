// Use environment variables for API URLs
const owner_baseURL = process.env.NEXT_PUBLIC_API_BASE_URL + "/owner?ownerID=";
const company_baseURL = process.env.NEXT_PUBLIC_COMPANY_API;  
const product_baseURL = process.env.NEXT_PUBLIC_PRODUCT_API + "?productID=";
const plugin_baseURL = process.env.NEXT_PUBLIC_PRODUCT_API + "/sku";

export async function fetcher_Owner(ownerID) {
  const response = await fetch(owner_baseURL + ownerID);
  const data = await response.json();
  return data.data || data; // Handle new response format
}

export async function fetcher_Company(companyID) {  
  const apiURL = company_baseURL + "?companyID=" + companyID; 
  const response = await fetch(apiURL);
  const data = await response.json();
  return data.data || data; // Handle new response format
}

export async function fetcher_CompanyURL(companyURL) {
  const apiURL = company_baseURL + "/url?companyURL=" + companyURL;
  const response = await fetch(apiURL);
  const data = await response.json();
  return data.data || data; // Handle new response format
}

export async function fetcher_AllCompanies(companyList) {
  const companyIDs = companyList.map((company) => company.companyID);
  var fullData = [];

  for (let i = 0; i < companyIDs.length; i++) {
    const response = await fetch(company_baseURL + "?companyID=" + companyIDs[i]);
    const data = await response.json();
    fullData.push(data.data || data); // Handle new response format
  }

  return fullData;
}

export async function fetcher_Product(productID) {
  const response = await fetch(product_baseURL + productID);
  const data = await response.json();
  const payload = data.data || data;
  return { data: payload };
}

export async function fetcher_Plugin(apiData) {
  const response = await fetch(
    plugin_baseURL + "?sku=" + apiData[0] + "&companyID=" + apiData[1]
  );
  const data = await response.json();
  const payload = data.data || data;
  return { data: payload };
}
