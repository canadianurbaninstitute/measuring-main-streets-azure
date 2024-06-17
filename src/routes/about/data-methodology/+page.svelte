<script>
	import '../../styles.css';
	import Footer from '../../lib/Footer.svelte';
	import Icon from '@iconify/svelte';

  let mainStreetCollapsed = true;
  let civicInfrastructureCollapsed = true;

  function toggleMainStreet() {
    mainStreetCollapsed = !mainStreetCollapsed;
  }

  function toggleCivicInfrastructure() {
    civicInfrastructureCollapsed = !civicInfrastructureCollapsed;
  }

</script>


<div class="hero">
    <div class="subtitle">
		<h1>Data</h1>
	</div>

	<h2>1. Business and Civic Infrastructure Location Data (Environics Analytics, 2023)</h2>
	<p>Business and Civic Infrastructure location data sourced from Environics Analytics provides the spatial location of all businesses and civic infrastructure tracked by InfoCanada. The data includes the name, address, NAICS Code and a unique identifier for over 1.1 million businesses. The business data is used to derive the presence and composition of two the categories, each of which are further split up into subcategories, by using their respective four and six-digit NAICS codes:	</p>
	<ul>
		<li> Main Street businesses (four-digit NAICS Codes)</li>
		<ul>
			<li>Retail</li>
			<li>Food & Drink</li>
			<li>Local Services</li>
		</ul>
		<br>
		<li> Civic Infrastructure (six-digit NAICS Codes)</li>
		<ul>
			<li>Arts and Culture</li>
			<li>Education</li>
			<li>Government and Community Services</li>
			<li>Healthcare</li>
			<li>Recreation Facilities</li>
		</ul>
	</ul>
	<p>For more information on the definition of these categories, click here to read a detailed methodology.</p>

	<h2>2. Demographic Data (Environics Analytics DemoStats, 2023; Statistics Canada, 2021)</h2>
	<p>The demographic data combines proprietary data from Environics Analytics DemoStats, updated yearly, with open-source data from the 2021 census, where the equivalent Environics DemoStats is unavailable. The demographic data includes population counts, housing data, basic demographic information, and commuting data.</p>

	<h2>3. Mobile Visitor Count Data (Environics Analytics MobileScapes, 2019 – 2022)</h2>
	<p>Visitor Count data is derived using Environics Analytics MobileScapes data, a mobile movement database developed from permission-based data collected using location-enabled mobile applications. The MobileScapes data is only collected for the buildings within the case study area, providing accurate visitor numbers for the time of day, week, and month. In addition, the mobile data also provides visitors' common daytime (work) and evening (home) locations to analyze visitor types, distances, and changes in spatial patterns over time. The MobileScapes data for the purpose of our analysis is defined in two ways:	</p>
	<ul>
		<li>Visits – Anytime an individual enters a building within the study area, they can be counted more than once.</li>
		<li>Visitor – A unique individual entering any building within the study area. It can only be counted once.</li>
	</ul>
	<h2>4. National Road Network (Statistics Canada, 2023)</h2>
	<p>The NRN was adopted by members of the Inter-Agency Committee on Geomatics (IACG) and the Canadian Council on Geomatics (CCOG) to provide quality, homogeneous, and normalized geospatial and attributive data (current, accurate, consistent) for the entire Canadian road network. The NRN is part of the GeoBase initiative, which aims to provide a common geospatial infrastructure maintained regularly by closest-to-source organizations. (Statistics Canada, 2023)	</p>
	<p>The NRN is distributed as thirteen provincial/territorial datasets consisting of two linear entities (road segments and ferry segments), three punctual entities (junctions, blocked passages, and toll points), and three tabular entities (address ranges, street and place names, and alternative name linkages). Currently, the NRN is publicly available on the <a href="https://open.canada.ca/en">Open Government data portal</a>.</p>
	<div>
		<h2>5. Dataset Summary Table</h2>
		<br>
		<table>
		  <tbody>
			<tr>
			  <td>
				<strong>Data Set</strong>
			  </td>
			  <td>
				<strong>Scale</strong>
			  </td>
			  <td>
				<strong>Usage</strong>
			  </td>
			</tr>
			<tr>
			  <td>Business and Civic Location Data</td>
			  <td>National (point data)</td>
			  <td>Platform, Case Studies, Reports, Tools</td>
			</tr>
			<tr>
			  <td>Demographic Data</td>
			  <td>National (Dissemination Area)</td>
			  <td>Platform, Case Studies, Reports, Tools</td>
			</tr>
			<tr>
			  <td>Mobile Visitor Count Data</td>
			  <td>Case Study (Building Footprint)</td>
			  <td>Case Studies, Reports, Tools</td>
			</tr>
			<tr>
			  <td>National Road Network</td>
			  <td>National (Line Data)</td>
			  <td>Platform, Case Studies, Tools</td>
			</tr>
		  </tbody>
		</table>
	  </div>

</div>


<div class="hero">
    <div class="subtitle">
		<h1>Methodology</h1>
	</div>
	<h2>Creating Canada's Main Street Network</h2>
	<p>Creating a comprehensive main street network for Canada began with a clear goal: identifying segments of roads where clusters of Main Street Businesses and Civic Infrastructure are co-located and concentrated across the country. In order to arrive at this final dataset, we underwent an iterative process, gathering feedback along every step of the way from project stakeholders, users and policy experts. 
	</p>
	<p>After identifying the main street network, we also attached demographic information (from the 2021 Census and other proprietary data sets), in order to provide insights about the surrounding area and its residents. The methodology will be broken down into four main sections.
	</p>
	<ul>
		<li>1. Business and Civic Infrastructure Data Setup</li>
		<li>2. Road Network Setup</li>
		<li>3. Attaching Data</li>
		<li>4. Identifying High and Low Density Main Streets</li>
	</ul>

	<hr>

	<h3>1. Business and Civic Infrastructure Data Setup</h3>
	<p>The first task in creating Canada’s main street network was identifying the types of businesses and civic infrastructure associated with main streets. Based on the four and 6-digit North American Industry Classification System (NAICS) codes, points within the Business and Civic Location Data were classified into one of three Main Street Business Groups (Retail, Food and Drink or Local Services) or one of five Civic Infrastructure Groups (Arts and Culture, Education, Government and Community Services, Healthcare, and Recreation) as seen in the table below. 
	</p>
	<p>In addition, within the Local Services Business Sub Group, businesses under NAICS code categories such as Depository Credit, Accounting, Legal Services, Telecom stores, and Real Estate Offices, had to have less than 50 employees to confirm that they were local instances. For example, to ensure we identified local bank branches and filtered out corporate office locations that may have both been classified under the same NAICS code.
	</p>
	<h4 on:click={toggleMainStreet}>Main Street Business Table (Click to expand)</h4> 
	<div class="collapsible-content {mainStreetCollapsed ? '' : 'expanded'}">
		<table>
		  <tbody>
			<tr>
			  <td>
				<strong>4-Digit NAICS Code</strong>
			  </td>
			  <td>
				<strong>NAICS Code Description</strong>
			  </td>
			  <td>
				<strong>Main Street Business Group</strong>
			  </td>
			</tr>
			<tr>
				<td>7224</td>
				<td>Drinking places</td>
				<td rowspan=2>Food and Drink</td>
			  </tr>
			  <tr>
				<td>7225</td>
				<td>Restaurants</td>
			  </tr>
			<tr>
			  <td>4451</td>
			  <td>Grocery stores</td>
			  <td rowspan=30>Retail</td>
			</tr>
			<tr>
			  <td>4452</td>
			  <td>Specialty food stores</td>
			</tr>
			<tr>
			  <td>4453</td>
			  <td>Liquor stores</td>
			</tr>
			<tr>
			  <td>7223</td>
			  <td>Special food services</td>
			</tr>
			<tr>
			  <td>4411</td>
			  <td>Auto dealers</td>
			</tr>
			<tr>
			  <td>4412</td>
			  <td>Other motor vehicle dealers</td>
			</tr>
			<tr>
			  <td>4413</td>
			  <td>Auto Parts Retailers</td>
			</tr>
			<tr>
			  <td>4421</td>
			  <td>Furniture Stores</td>
			</tr>
			<tr>
			  <td>4422</td>
			  <td>Home furnishings stores</td>
			</tr>
			<tr>
			  <td>4431</td>
			  <td>Electronic and Appliance Stores</td>
			</tr>
			<tr>
			  <td>4441</td>
			  <td>Building material stores</td>
			</tr>
			<tr>
			  <td>4442</td>
			  <td>Lawn and garden stores</td>
			</tr>
			<tr>
			  <td>4461</td>
			  <td>Pharmacies and Drug Stores</td>
			</tr>
			<tr>
			  <td>4471</td>
			  <td>Gasoline stores</td>
			</tr>
			<tr>
			  <td>4481</td>
			  <td>Clothing stores</td>
			</tr>
			<tr>
			  <td>4482</td>
			  <td>Shoe stores</td>
			</tr>
			<tr>
			  <td>4483</td>
			  <td>Jewellery, and leather goods</td>
			</tr>
			<tr>
			  <td>4511</td>
			  <td>Sporting goods, hobby, and music stores</td>
			</tr>
			<tr>
			  <td>4513</td>
			  <td>Book stores</td>
			</tr>
			<tr>
			  <td>4521</td>
			  <td>Department stores</td>
			</tr>
			<tr>
			  <td>4529</td>
			  <td>Other general stores</td>
			</tr>
			<tr>
			  <td>4531</td>
			  <td>Florists</td>
			</tr>
			<tr>
			  <td>4532</td>
			  <td>Office supplies</td>
			</tr>
			<tr>
			  <td>4533</td>
			  <td>Used merchandise stores</td>
			</tr>
			<tr>
			  <td>4539</td>
			  <td>Other retailers</td>
			</tr>
			<tr>
			  <td>4541</td>
			  <td>Electronic shopping</td>
			</tr>
			<tr>
			  <td>4542</td>
			  <td>Vending machine operators</td>
			</tr>
			<tr>
			  <td>4543</td>
			  <td>Direct selling</td>
			</tr>
			<tr>
			  <td>5173</td>
			  <td>Telecom stores</td>
			</tr>
			<tr>
			  <td>5312</td>
			  <td>Real estate offices</td>
			</tr>
			<tr>
			  <td>4911</td>
			  <td>Postal Service</td>
			  <td rowspan=12>Local Services</td>
			</tr>
			<tr>
			  <td>5221</td>
			  <td>Depository Credit</td>
			</tr>
			<tr>
			  <td>5411</td>
			  <td>Legal Services</td>
			</tr>
			<tr>
			  <td>5412</td>
			  <td>Accounting</td>
			</tr>
			<tr>
			  <td>8111</td>
			  <td>Auto repair</td>
			</tr>
			<tr>
			  <td>8112</td>
			  <td>Electronic repair</td>
			</tr>
			<tr>
			  <td>8113</td>
			  <td>Commercial equipment repair</td>
			</tr>
			<tr>
			  <td>8114</td>
			  <td>Household goods repair</td>
			</tr>
			<tr>
			  <td>8121</td>
			  <td>Personal care</td>
			</tr>
			<tr>
			  <td>8122</td>
			  <td>Funeral services</td>
			</tr>
			<tr>
			  <td>8123</td>
			  <td>Dry Cleaning</td>
			</tr>
			<tr>
			  <td>8129</td>
			  <td>Other personal services</td>
			</tr>
		  </tbody>
		</table>
	  </div>
	  <h4 on:click={toggleCivicInfrastructure}>Civic Infrastructure Table (Click to expand)</h4>
	  <div class="collapsible-content {civicInfrastructureCollapsed ? '' : 'expanded'}">
		<table>
		  <tbody>
			<tr>
			  <td>
				<strong>6-Digit NAICS Code</strong>
			  </td>
			  <td>
				<strong>Description</strong>
			  </td>
			  <td>
				<strong>Group</strong>
			  </td>
			</tr>
			<tr>
			  <td>519120</td>
			  <td>Libraries</td>
			  <td rowspan=8>Arts and Culture</td>
			</tr>
			<tr>
			  <td>711110</td>
			  <td>Theatre companies</td>
			</tr>
			<tr>
			  <td>711120</td>
			  <td>Dance Companies</td>
			</tr>
			<tr>
			  <td>711130</td>
			  <td>Musical Groups and Artists</td>
			</tr>
			<tr>
			  <td>711190</td>
			  <td>Other Performing Arts Companies</td>
			</tr>
			<tr>
			  <td>711510</td>
			  <td>Independent Artists, Writers and Performers</td>
			</tr>
			<tr>
			  <td>712110</td>
			  <td>Museums</td>
			</tr>
			<tr>
			  <td>712120</td>
			  <td>Historical Sites</td>
			</tr>
			<tr>
			  <td>611110</td>
			  <td>Elementary and secondary schools</td>
			  <td rowspan=10>Education</td>
			</tr>
			<tr>
			  <td>611210</td>
			  <td>Community Colleges</td>
			</tr>
			<tr>
			  <td>611310</td>
			  <td>Universities</td>
			</tr>
			<tr>
			  <td>611410</td>
			  <td>Business and Secretarial schools</td>
			</tr>
			<tr>
			  <td>611519</td>
			  <td>Technical and trade schools</td>
			</tr>
			<tr>
			  <td>611610</td>
			  <td>Fine arts schools</td>
			</tr>
			<tr>
			  <td>611630</td>
			  <td>Language schools</td>
			</tr>
			<tr>
			  <td>611699</td>
			  <td>All other schools and instruction</td>
			</tr>
			<tr>
			  <td>611710</td>
			  <td>Educational support services</td>
			</tr>
			<tr>
			  <td>624410</td>
			  <td>Child day-care services</td>
			</tr>
			<tr>
			  <td>624110</td>
			  <td>Child and youth services</td>
			  <td rowspan=17>Government and Community Services</td>
			</tr>
			<tr>
			  <td>624120</td>
			  <td>Services for the elderly and persons with disabilities</td>
			</tr>
			<tr>
			  <td>624190</td>
			  <td>Other individual and family services</td>
			</tr>
			<tr>
			  <td>624210</td>
			  <td>Community Food Services</td>
			</tr>
			<tr>
			  <td>624221</td>
			  <td>Temporary Shelters</td>
			</tr>
			<tr>
			  <td>624229</td>
			  <td>Other Community Housing Services</td>
			</tr>
			<tr>
			  <td>624310</td>
			  <td>Vocational rehabilitation services</td>
			</tr>
			<tr>
			  <td>813110</td>
			  <td>Religious organizations</td>
			</tr>
			<tr>
			  <td>813210</td>
			  <td>Grant-making and giving services</td>
			</tr>
			<tr>
			  <td>813310</td>
			  <td>Social advocacy organization</td>
			</tr>
			<tr>
			  <td>813410</td>
			  <td>Civic and Social Organizations</td>
			</tr>
			<tr>
			  <td>921110</td>
			  <td>Executive Offices</td>
			</tr>
			<tr>
			  <td>921120</td>
			  <td>Legislative Bodies</td>
			</tr>
			<tr>
			  <td>921190</td>
			  <td>Other General Government Support</td>
			</tr>
			<tr>
			  <td>922110</td>
			  <td>Courts</td>
			</tr>
			<tr>
			  <td>922120</td>
			  <td>Police Protection</td>
			</tr>
			<tr>
			  <td>922160</td>
			  <td>Fire Protection</td>
			</tr>
			<tr>
			  <td>621111</td>
			  <td>Office of physicians</td>
			  <td rowspan=19>Healthcare</td>
			</tr>
			<tr>
			  <td>621210</td>
			  <td>Office of dentists</td>
			</tr>
			<tr>
			  <td>621310</td>
			  <td>Office of chiropractors</td>
			</tr>
			<tr>
			  <td>621320</td>
			  <td>Office of optometrists</td>
			</tr>
			<tr>
			  <td>621330</td>
			  <td>Office of mental health practitioners</td>
			</tr>
			<tr>
			  <td>621340</td>
			  <td>Office of physical, occupational and speech therapists</td>
			</tr>
			<tr>
			  <td>621391</td>
			  <td>Office of Podiatrists</td>
			</tr>
			<tr>
			  <td>621399</td>
			  <td>Office of all other health practitioners</td>
			</tr>
			<tr>
			  <td>621410</td>
			  <td>Family planning centres</td>
			</tr>
			<tr>
			  <td>621420</td>
			  <td>Out-patient mental health and substance abuse centres</td>
			</tr>
			<tr>
			  <td>621494</td>
			  <td>Community health centres</td>
			</tr>
			<tr>
			  <td>621498</td>
			  <td>All other out-patient care centres</td>
			</tr>
			<tr>
			  <td>622110</td>
			  <td>General Hospitals</td>
			</tr>
			<tr>
			  <td>622210</td>
			  <td>Psychiatric and substance abuse hospitals</td>
			</tr>
			<tr>
			  <td>622310</td>
			  <td>Specialty hospitals</td>
			</tr>
			<tr>
			  <td>623110</td>
			  <td>Nursing care facilities</td>
			</tr>
			<tr>
			  <td>623311</td>
			  <td>Continuing Care Retirement Communities</td>
			</tr>
			<tr>
			  <td>623312</td>
			  <td>Assisted Living Facilities for the Elderly</td>
			</tr>
			<tr>
			  <td>623990</td>
			  <td>Other Residential Care Facilities</td>
			</tr>
			<tr>
			  <td>712130</td>
			  <td>Zoos and botanical gardens</td>
			  <td rowspan=5>Recreation</td>
			</tr>
			<tr>
			  <td>712190</td>
			  <td>Nature parks and other similar institutions</td>
			</tr>
			<tr>
			  <td>713940</td>
			  <td>Fitness and recreational sports centres</td>
			</tr>
			<tr>
			  <td>713950</td>
			  <td>Bowling centres</td>
			</tr>
			<tr>
			  <td>713990</td>
			  <td>All other amusement and recreation industries</td>
			</tr>
		  </tbody>
		</table>
	  </div>
	  <h4>Attaching Additional Data	</h4>
	  <p>The final step was summarising the estimated employment size and retail sales, as well as our Business Independence Index, which uses text-based analysis to assess the uniqueness of each business between 0 and 1 (defined below).</p>
	  <h3>2. Road Network Setup</h3>
	  <p>In order to identify main streets, we had to use a road network dataset to use in our analysis. Setting up the road network is a crucial step in the methodology as it is also the median through which all infrastructure and demographic data will be attached and visualized. Before this can happen, several cleaning steps are performed on the Statistics Canada national road network.	</p>
	  <h4>Defining large and small city networks</h4>
	  <p>The first step in setting up the road network is determining what types of roads should be included in the network. The table below outlines our methodology in creating the road network; which differs in large and small cities. A city is defined as large or small based on its population count and population density, and the types of roads included are different in each. This was done to remove mainly residential areas in large cities while maintaining small local roads in small towns.	</p>
	  <div>
		<table>
		  <tbody>
			<tr>
			  <td>City Type</td>
			  <td>Condition</td>
			  <td>Roads Used</td>
			</tr>
			<tr>
			  <td>Large City</td>
			  <td>Population Count Above 100,000 and Population Density Above 1,000 / sq.km</td>
			  <td>Arterial, Collector, Local Highways</td>
			</tr>
			<tr>
			  <td>Small City</td>
			  <td>Population Count Below 100,000 or Population Density Below 1,000 / sq.km</td>
			  <td>Arterial, Collector, Local Highways, Local Streets</td>
			</tr>
		  </tbody>
		</table>
	  </div>
	  <p>Using the ‘sfnetworks’ package in R, lines in the road network are cleaned to simplify edges and reduce redundancy after the initial filtering of the roads. First, the road network is simplified to remove multiple edges and loops. Next, pseudo nodes are removed to have nodes where the endpoints of roads meet. Finally, intersections between the roads are simplified, adjoining all converging roads to a single node.
	</p>
	<h3>3. Attaching Data</h3>
	<h4>Attaching Business and Civic Infrastructure Data</h4>
	<p>After cleaning the Infrastructure and Road Networks, a spatial intersection was performed, attaching all main street businesses and civic infrastructure to all roads within 50 metres of the desired road segment. The counts of each main street business and civic infrastructure type were summarised, producing a total for each road segment. In addition, the densities of main street businesses and civic infrastructure were calculated by dividing the total by the road length.
	</p>
	<p>For summary statistics using Main Street business data, such as the Business Independence Index and Retail Sales, the average for all businesses along the road was used. The employment size of the businesses was also considered for the Business Independence Index.
	</p>
	<h4>Attaching Demographic Data</h4>
	<p>Demographic variables were intersected between the road network and all Dissemination Areas within one kilometre of the adjoining road segment. For each road segment, variables were summarised by taking the average of all Dissemination Areas weighted by the Population count of each DA.</p>
	<h3>4. Identifying Main Streets	</h3>
	<p>With the creation of our base road network, we can now identify main streets as a segment of road where a clustering of main street businesses and civic infrastructure exists. This process is done over two primary steps. Identifying businesses and civic infrastructure clusters and extracting segments based on density thresholds.
	</p>
	<h4>Identifying Main Street Business and Civic Infrastructure Clusters</h4>
	<p>Using the cleaned Business and Civic Location Data, Kernel Density Estimation in QGIS created a heatmap of main street businesses and civic data. The heatmap layer was then filtered based on the set density thresholds of high-density and low-density main streets.
	</p>
	<div>
		<table>
		  <tbody>
			<tr>
			  <td>Main Street Type</td>
			  <td>Parameters</td>
			  <td>Density Thresholds</td>
			</tr>
			<tr>
			  <td>Low-Density Main Streets</td>
			  <td>Radius: 100 metres <br> Kernel Shape: Quartic</td>
			  <td>Above 2 Main Street Business and Civic Infrastructure within the defined radius</td>
			</tr>
			<tr>
			  <td>High-Density Main Streets</td>
			  <td>Radius: 100 metres <br> Kernel Shape: Quartic</td>
			  <td>Above 10 Main Street Business and Civic Infrastructure within the defined radius</td>
			</tr>
		  </tbody>
		</table>
	  </div>
	  <h4>Extracting Segments Based on Density Thresholds</h4>
	  <p>The final main street layer for high and low-density main streets was then clipped from the respective heatmap layers, and a difference between the two road layers was performed to prevent overlaps.	</p>
</div>	

<div class="hero">
	<h2>Independent Business Index</h2>
	<p>The Independent Business Index creates a scaled index of business independence using text analysis within the Main Street Business Dataset to apply a scale between 0 and 1 based on how many times a business name appears in the data. The closer the value is to 1, the more ‘independent’ the business is deemed.
	</p>
	<p>From the Main Street Business Location Dataset, businesses are grouped based on their name and primary industry using the 2-digit NAICS code associated with the business. Once grouped, the businesses are min-max scaled, giving a value between 0 and 1, with 0 being the most prevalent name in the business data and one being the least prevalent.
	</p>
	<p>This methodology allows us to account for differences in chain businesses, so a small local chain with 5 locations is deemed more ‘independent’ than a large national chain with 200+ locations, for example.
	</p>
</div>

<div class="hero">
	<h2>Civic Infrastructure Index</h2>
	<p>The Civic Infrastructure Index (CII) assesses relative access to civic infrastructure within a defined catchment area by combining services' capacity with the local population's demand.
	</p>
	<p>Based on two-step floating catchment areas</p>
	<ul>
	<li>Assessing civic infrastructure supply as a ratio of civic employment to their surrounding population within 1 kilometre.
	</li>
	<li>Sum the ratios, and the civic infrastructure supply from step 1 is within the same distance threshold for each population centre, the dissemination area.
	</li>
</ul>
</div>

<div class="hero">
	<h1>Have more questions?</h1>
	<p>Contact us at <a href="mailto:cui@canurb.org?subject=Measuring Main Streets Enquiry">cui@canurb.org</a>.</p>
</div>


<div class="hero">
	<br><br><br>
</div>






<Footer/>

<style>
table, td {
  border: 1px solid #ddd;
  border-collapse: collapse;
  padding: 1em;
}

h4, h3 {
	margin: 1em 0 1em 0;
}

@media only screen and (min-width: 768px) {

p {
	max-width: 80%;
}
}

.collapsible-content {
    overflow: hidden;
    transition: max-height 0.3s ease;
    max-height: 0;
  }

  .collapsible-content.expanded {
    max-height: 1000px; /* Adjust based on content size */
  }

  h4 {
    cursor: pointer;
  }
</style>
