const Blog = require('../models/Blog');
const slugify = require('slugify');


const createSearchRegex = (str) => {
    const simplified = decodeURIComponent(str.replace(/-/g, ' ')).replace(/[^a-z0-9]/gi, '');
    return new RegExp('^' + simplified.split('').join('\\W*') + '$', 'i');
};

const blogController = {
    // Create a new blog post
    create: async (req, res) => {
        const { title, description, content, metaTitle, metaDescription, metaKeywords, tags, publish } = req.body;
        try {
            const slug = slugify(title, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
            const url = 'https://' + req.get('host');
            const newBlog = new Blog({
                slug,
                title,
                description,
                content,
                coverUrl: req.file ? `${url}/uploads/${req.file.filename}` : 'default-cover-url',
                metaTitle,
                metaDescription,
                metaKeywords,
                tags,
                publish,
            });
            await newBlog.save();
            res.status(201).json(newBlog);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Edit a blog post
    edit: async (req, res) => {
        const url = 'https://' + req.get('host');

        try {
            const updateData = {
                ...req.body,
                updatedAt: Date.now()
            };

            // Check if a new file is uploaded and include the coverUrl in the updateData
            if (req.file) {
                updateData.coverUrl = `${url}/uploads/${req.file.filename}`;
            }

            const updatedBlog = await Blog.findOneAndUpdate(
                { slug: req.params.slug },
                updateData,
                { new: true }
            );

            if (!updatedBlog) {
                return res.status(404).json({ message: 'Blog post not found' });
            }

            res.status(200).json(updatedBlog);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Other methods remain largely unchanged but ensure they handle the updated schema correctly

    // View a single blog post with author details populated
    view: async (req, res) => {
        try {
            const { title } = req.query;  // Assume you pass slug in params
            const blog = await Blog.findOne({ slug: title });
            if (!blog) {
                return res.status(404).json({ message: 'Blog post not found' });
            }
            res.status(200).json({ post: blog });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // List all blog posts with author details populated
    list: async (req, res) => {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = 10;

            const skip = (page - 1) * limit;
            const totalItems = await Blog.countDocuments();
            const blogs = await Blog.find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const totalPages = Math.ceil(totalItems / limit);

            res.status(200).json({
                posts: blogs,
                page,
                totalPages,
                totalItems,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    latest: async (req, res) => {
        try {
            const latestBlogPost = await Blog.find({})
                .populate('author', 'name avatarUrl')
                .sort({ createdAt: -1 })
                .limit(4)
                .select('title coverUrl createdAt')
                .lean();

            if (!latestBlogPost.length) {
                return res.status(404).json({ message: 'No blog posts found' });
            }

            res.status(200).json({ posts: latestBlogPost });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getLatestFeatured: async (req, res) => {
        try {
            const latestFeaturedPost = await Blog.findOne({ isFeatured: true })
                .select('title featuredImage content createdAt isFeatured')
                .sort({ createdAt: -1 })
                .lean();

            if (!latestFeaturedPost) {
                return res.status(404).json({ message: 'No featured blog posts found' });
            }

            const trimmedContent = latestFeaturedPost.content.substring(0, 180);

            const response = {
                ...latestFeaturedPost,
                content: trimmedContent,
            };

            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

};


module.exports = blogController;
