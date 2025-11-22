import React, { useState, useEffect } from "react";
// app/education/Education.jsx
import { blogs, getBlogsByCategory } from "../data/blogs";

const PRIMARY = "#5A8807";
const PRIMARY_LIGHT = "#E8F5D4";

const Education = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);
  const [isLoading, setIsLoading] = useState(false);

  // Extract unique categories from blogs
  const categories = ["all", ...Array.from(new Set(blogs.map((blog) => blog.category)))];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (selectedCategory === "all") {
        setFilteredBlogs(blogs);
      } else {
        setFilteredBlogs(getBlogsByCategory(selectedCategory));
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory]);

  return (
    <>
      {/* Hero section */}
      <div className="relative h-80 md:h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1605600659873-d808a13e4d9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
            transform: "translateZ(0)",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            E-Waste Education Hub
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto opacity-90">
            Gain valuable insights into sustainable electronics management and discover how your
            choices can make a significant environmental impact.
          </p>
        </div>
      </div>

      <div className="section w-full mx-auto bg-gray-50 py-12">


        {/* Featured article */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-16 max-w-5xl mx-auto transform transition-transform hover:scale-[1.01]">
          <div className="md:flex">
            <div className="md:w-1/2 relative h-64 md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="E-waste management and sustainability"
                className="h-full w-full object-cover"
              />
              <div
                className="absolute top-0 left-0 text-white py-1 px-3 rounded-br-lg font-semibold"
                style={{ backgroundColor: PRIMARY }}
              >
                FEATURED
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <div className="flex items-center mb-3">
                <span
                  className="text-xs font-medium px-2.5 py-0.5 rounded mr-2"
                  style={{ backgroundColor: PRIMARY_LIGHT, color: PRIMARY }}
                >
                  Education
                </span>
                <span className="text-gray-500 text-sm">8 min read</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-4">
                The Growing E-Waste Crisis: Understanding Our Digital Footprint
              </h2>
              <p className="text-gray-600 mb-6">
                The rapid pace of technological advancement has transformed modern life, but it
                comes with a hidden cost - electronic waste. Learn how your devices impact the
                planet and what you can do to minimize your digital carbon footprint.
              </p>
              <div className="flex items-center mb-6">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3"
                  style={{ backgroundColor: PRIMARY }}
                >
                  E
                </div>
                <div>
                  <p className="text-sm font-semibold">ELocate Research Team</p>
                  <p className="text-xs text-gray-500">June 15, 2023</p>
                </div>
              </div>
              <a
                href={`/education/1`}
                className="inline-flex items-center px-4 py-2 text-white font-medium rounded-lg transition-colors"
                style={{ backgroundColor: PRIMARY }}
              >
                Read Full Article
                <svg
                  className="ml-2 -mr-1 w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Category filter */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Educational Resources</h2>
            <div className="flex mt-4 md:mt-0 overflow-x-auto pb-2 -mx-2 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="px-4 py-2 mx-1 text-sm font-medium rounded-full transition-colors whitespace-nowrap"
                  style={
                    selectedCategory === category
                      ? { backgroundColor: PRIMARY, color: "#FFFFFF" }
                      : { backgroundColor: "#F3F4F6", color: "#374151" }
                  }
                >
                  {category === "all" ? "All Topics" : category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog grid */}
        <div className="max-w-6xl mx-auto">
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative ${isLoading ? "opacity-50" : "opacity-100"
              } transition-opacity duration-300`}
          >
            {filteredBlogs.map((blog, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={`Image for ${blog.title}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent w-full h-24 pointer-events-none"></div>
                  <div className="absolute bottom-3 left-3">
                    <span
                      className="text-xs font-medium px-2.5 py-0.5 rounded"
                      style={{ backgroundColor: PRIMARY_LIGHT, color: PRIMARY }}
                    >
                      {blog.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500 text-sm">{blog.readTime}</span>
                    {blog.date && <span className="text-gray-500 text-sm">{blog.date}</span>}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{blog.description}</p>

                  {blog.tags && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded"
                          style={{ backgroundColor: "#F3F4F6", color: "#4B5563" }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: PRIMARY }}
                      >
                        {blog.author ? blog.author.charAt(0) : "E"}
                      </div>
                      {blog.author && (
                        <span className="ml-2 text-sm text-gray-700 truncate max-w-[120px]">
                          {blog.author}
                        </span>
                      )}
                    </div>
                    <a
                      href={`/education/${blog.id}`}
                      className="inline-flex items-center font-medium"
                      style={{ color: PRIMARY }}
                    >
                      Read More
                      <svg
                        className="ml-1 w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty state */}
          {filteredBlogs.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-300 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No articles found</h3>
              <p className="text-gray-500 mb-4">
                We couldn&apos;t find any articles in this category.
              </p>
              <button
                onClick={() => setSelectedCategory("all")}
                className="font-medium"
                style={{ color: PRIMARY }}
              >
                View all articles
              </button>
            </div>
          )}
        </div>

        {/* E-waste facts */}
        <div
          className="mt-24 rounded-lg p-8 max-w-6xl mx-auto"
          style={{ backgroundColor: PRIMARY_LIGHT }}
        >
          <div className="text-center mb-10">
            <h2
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{ color: PRIMARY }}
            >
              E-Waste Facts You Should Know
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Understanding the impact of electronic waste is the first step toward making better
              choices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "57.4 Million Tons",
                text:
                  "Global e-waste generated annually, equivalent to the weight of 5,000 Eiffel Towers",
                path:
                  "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
              },
              {
                title: "$62.5 Billion",
                text:
                  "Value of raw materials in global e-waste, more than the GDP of many countries",
                path:
                  "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                title: "17.4%",
                text:
                  "Only 17.4% of e-waste is properly recycled globally, the rest ends up in landfills",
                path:
                  "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
              },
              {
                title: "80 kg of Earth",
                text:
                  "Recycling one smartphone prevents mining approximately 80 kg of raw earth materials",
                path: "M13 10V3L4 14h7v7l9-11h-7z",
              },
            ].map((fact) => (
              <div
                key={fact.title}
                className="bg-white p-6 rounded-lg shadow-sm text-center group hover:shadow-md transition-all"
              >
                <div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 group-hover:opacity-80 transition"
                  style={{ backgroundColor: PRIMARY_LIGHT }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: PRIMARY }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={fact.path}
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">{fact.title}</h3>
                <p className="text-gray-600 text-sm">{fact.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Educational videos */}
        <div className="mt-24 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Educational Videos
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visual learning resources to help you understand the e-waste challenge and solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Video 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition hover:shadow-lg hover:-translate-y-1">
              <div className="relative pb-[56.25%] h-0">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/Jzw1zv1zz0E"
                  title="The E-Waste Crisis"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">The E-Waste Crisis Explained</h3>
                <p className="text-gray-600 mb-3">
                  Learn about the growing e-waste problem and its environmental impact
                </p>
                <div className="flex items-center text-gray-500 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: PRIMARY }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>10:23</span>
                </div>
              </div>
            </div>

            {/* Video 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition hover:shadow-lg hover:-translate-y-1">
              <div className="relative pb-[56.25%] h-0">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/4g9Zu3pOIYU"
                  title="What Happens to Your E-Waste"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">Inside an E-Waste Recycling Facility</h3>
                <p className="text-gray-600 mb-3">
                  See the journey of electronic devices through the recycling process
                </p>
                <div className="flex items-center text-gray-500 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: PRIMARY }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>8:47</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Infographics */}
        <div className="mt-24 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              E-Waste Infographics
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visual guides to help understand the e-waste challenge and potential solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "The Lifecycle of Electronics",
                img:
                  "https://images.unsplash.com/photo-1605600659873-d808a13e4d9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                text:
                  "From production to disposal: understanding the full journey of electronic devices",
              },
              {
                title: "Valuable Materials in E-Waste",
                img:
                  "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                text:
                  "Identifying the precious metals and materials that can be recovered from electronic waste",
              },
              {
                title: "10 Ways to Reduce Your E-Waste",
                img:
                  "https://images.unsplash.com/photo-1546156929-a4c0ac411f47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                text:
                  "Practical tips for consumers to minimize electronic waste generation in daily life",
              },
            ].map((info) => (
              <div key={info.title} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-64">
                  <img
                    src={info.img}
                    alt={info.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2">{info.title}</h3>
                  <p className="text-gray-600 text-sm">{info.text}</p>
                  <a
                    href="#"
                    className="mt-3 inline-block font-medium text-sm"
                    style={{ color: PRIMARY }}
                  >
                    Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 max-w-6xl mx-auto">
          <div
            className="rounded-xl p-8 md:p-12 shadow-lg"
            style={{
              backgroundImage: `linear-gradient(to right, ${PRIMARY}, #4B7106)`,
            }}
          >
            <div className="md:flex items-center justify-between">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Take Action?
                </h2>
                <p className="text-emerald-50 text-lg mb-0">
                  Find certified e-waste recycling facilities near you and ensure your electronics
                  are handled responsibly.
                </p>
              </div>
              <div>
                <a
                  href="/facility-locator"
                  className="inline-block bg-white font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  style={{ color: PRIMARY }}
                >
                  Find Recycling Centers
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Education;
