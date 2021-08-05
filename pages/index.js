import Head from 'next/head'
import Image from 'next/image'
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";
import {
  InstantSearch,
  SearchBox,
  Hits,
  HierarchicalMenu,
  RefinementList,
  ToggleRefinement,
  RatingMenu,
  ClearRefinements,
  Stats,
  HitsPerPage,
  SortBy,
  Pagination,
} from 'react-instantsearch-dom'
import {RangeSlider} from "../components/RangeSlider";
import {Hit} from "../components/Hit";
import {assembleTypesenseServerConfig} from '../lib/utils'

// Initialize the Typesense Instantsearch adapter: https://github.com/typesense/typesense-instantsearch-adapter
const TYPESENSE_SERVER_CONFIG = assembleTypesenseServerConfig()
const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: TYPESENSE_SERVER_CONFIG,
  additionalSearchParameters: {
    // The following parameters are directly passed to Typesense's search API endpoint.
    //  So you can pass any parameters supported by the search endpoint below.
    //  queryBy is required.
    queryBy: 'name,categories,description',
    queryByWeights: '4,2,1',
    numTypos: 1,
    typoTokensThreshold: 1,
    // groupBy: "categories",
    // groupLimit: 1
    // pinnedHits: "23:2"
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;

export default function Home() {
  return (
    <div>
      <Head>
        <title>Ecommerce Store with Typesense + Next.js + Vercel</title>
        <link rel="icon" href="/favicon.png"/>
      </Head>

      <main>
        <InstantSearch indexName="products" searchClient={searchClient}>
          <div className="container-fluid px-md-5 pt-4">
            <div className="row d-flex align-items-center">
              <div className="col-md">
                <h1 className="display-6">
                  Ecommerce Store with Typesense + Next.js + Vercel
                </h1>
              </div>
              <div className="col-md-2 d-none d-md-block">
                <SearchBox/>
              </div>
            </div>

            <p className="lead mt-2">
              In addition to search experiences,
              Typesense can also be used to build <strong className="marker-highlight">blazing fast</strong>, <strong className="marker-highlight">browsing
              experiences</strong> like
              product listing pages in an ecommerce
              store • <a href="https://github.com/jasonbosco/showcase-nextjs-typesense-ecommerce-store" target="_blank" rel="noreferrer">Source
              Code</a>
            </p>


            <div className="row mt-4">
              <div className="col-md-3 pr-md-5">
                <h5>Browse by Categories</h5>
                <HierarchicalMenu
                  className="mt-3"
                  attributes={[
                    'categories.lvl0',
                    'categories.lvl1',
                    'categories.lvl2',
                    'categories.lvl3',
                  ]}
                  showParentLevel={true}
                  rootPath={"Cell Phones"}
                  limit={50}
                />

                <h5 className="mt-5">Filter by Brands</h5>
                <RefinementList
                  className="mt-3"
                  attribute="brand"
                  limit={10}
                  showMore={true}
                  showMoreLimit={50}
                  searchable={true}
                  transformItems={items =>
                    items.sort((a, b) => a.label > b.label ? 1 : -1)
                  }
                />

                <div className="mt-2">&nbsp;</div>

                <ToggleRefinement
                  className="mt-5"
                  attribute="free_shipping"
                  label="Free Shipping"
                  value={true}
                />

                <div className="mt-1">&nbsp;</div>

                <h5 className="mt-5">Filter by Price</h5>
                <RangeSlider attribute="price"/>

                <div className="mt-1">&nbsp;</div>

                <h5 className="mt-5">Filter by Rating</h5>
                <RatingMenu
                  className="mt-3"
                  attribute="rating"
                />

                <div className="mt-1">&nbsp;</div>

                <ClearRefinements className="mt-5"/>
              </div>
              <div className="col-md">

                <div className="row mt-5 mt-md-0">
                  <div className="col-md">
                    <div className="row">
                      <div className="col-md-4">
                      </div>
                      <div className="col-md-8 d-flex justify-content-end align-items-center">
                        <Stats translations={{
                          stats(nbHits, processingTimeMS) {
                            let hitCountPhrase
                            if (nbHits === 0) {
                              hitCountPhrase = 'No products'
                            } else if (nbHits === 1) {
                              hitCountPhrase = '1 product'
                            } else {
                              hitCountPhrase = `${nbHits.toLocaleString()} products`
                            }
                            return `${hitCountPhrase} found in ${processingTimeMS.toLocaleString()}ms`;
                          },
                        }}/>
                        <HitsPerPage
                          className="ms-4"
                          items={[
                            {label: '9 per page', value: 9},
                            {label: '18 per page', value: 18}
                          ]}
                          defaultRefinement={9}
                        />
                        <SortBy
                          items={[
                            {label: 'Relevancy', value: 'products'},
                            {label: 'Price (asc)', value: 'products/sort/price:asc'},
                            {label: 'Price (desc)', value: 'products/sort/price:desc'},
                          ]}
                          defaultRefinement="products"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-1">
                  <div className="col-sm">
                    <Hits hitComponent={Hit}/>
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm">
                    <Pagination />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </InstantSearch>
      </main>
    </div>
  )
}
