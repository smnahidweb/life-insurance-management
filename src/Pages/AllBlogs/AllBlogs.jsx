import React from 'react';
import UseAxios from '../../Hooks/UseAxios';
import { useQuery } from '@tanstack/react-query';
import { FaCalendarAlt, FaRegNewspaper } from 'react-icons/fa';
import { format } from 'date-fns';
import { Link } from 'react-router';

const AllBlogs = () => {
      const axiosPublic = UseAxios();

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["latestBlogs"],
    queryFn: async () => {
      const res = await axiosPublic.get("/blogs?limit=4&sort=desc");
      return res.data;
    },
  });
    return (
        <div>
             <div className="py-14">
                  <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center text-[var(--color-primary)] mb-2 flex items-center justify-center gap-2">
  <FaRegNewspaper className="text-[var(--color-primary)]" />
  Latest Blog & Articles
</h2>
                    <p className="text-center text-gray-600 mb-10 mt-4 mx-auto">
                      Stay updated with expert insights and helpful tips on insurance, finance, and more.
                    </p>
            
                    {isLoading ? (
                      <p className="text-center text-gray-500">Loading blogs...</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {blogs.map((blog) => (
                          <div
                            key={blog._id}
                            className=" border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300"
                          >
                            <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-2">
                              {blog.title}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 mb-3">
                              <FaCalendarAlt className="mr-2" />
                              {blog.publishDate
                                ? format(new Date(blog.publishDate), "PPP")
                                : "Unknown date"}
                            </div>
                            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                              {blog.content?.length > 150
                                ? blog.content.slice(0, 150) + "..."
                                : blog.content || "No summary available."}
                            </p>
                            <Link
                              to={`/blogs/${blog._id}`}
                              className="text-sm text-blue-600 font-medium hover:underline"
                            >
                              Read more →
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
            
                    {/* All Blogs Button */}
                  
                  </div>
                </div>
        </div>
    );
};

export default AllBlogs;