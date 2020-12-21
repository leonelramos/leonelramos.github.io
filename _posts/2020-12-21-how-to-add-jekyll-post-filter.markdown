---
layout: post
title: "Filtering Jekyll Blog Posts with Javascript"
author: "Leonel Ramos"
date: 2020-12-20 02:10:02 -0500
tags: tutorial
---

## Before We Start

For this tutorial I will be using a default Jekyll project on Ubuntu.<br>
That is, our starting point will be running the following command then going into our project folder.

{% highlight console %}
$ jekyll new blog-filter-tut
$ cd blog-filter-tut
{% endhighlight %}

By default, Jekyll projects come packaged with the theme <strong>Minima</strong>. We need to find where this theme is located in order to edit some of the default `layouts` that it has defined. It is fine if you do not know what a `layout` in Jekyll is, that will become clear later.

### If you don't have any existing blog posts

If you want to follow along this tutorial and actually see the filters work by the end then you'll need some dummy blog posts to filter.

Create three blogs in the `_posts` folder in your root project directory.

{% highlight console %}
$ touch ./_posts/2020-12-20-movie-reviews.md
$ touch ./_posts/2020-12-20-daily-thoughts.md
$ touch ./_posts/2020-12-20-cooking-blogs.md
{% endhighlight %}

In any text editor add the following <strong>Front Matter</strong> to the beginning of the blogs you just created. We will be filtering based on the `tags` a blog post has in it's Front Matter.

In `2020-12-20-movie-reviews.md` add
{% highlight html %}
---
layout: post
title:  "movie reviews"
date:   2020-12-20 22:26:01 -0500
tags: movie-reviews opinion-pieces
---
{% endhighlight %}

In `2020-12-20-daily-thoughts.md` add
{% highlight html %}
---
layout: post
title:  "daily thoughts"
date:   2020-12-20 22:26:01 -0500
tags: daily-thoughts opinion-pieces
---
{% endhighlight %}

In `2020-12-20-cooking-blog.md` add
{% highlight html %}
---
layout: post
title:  "recipes"
date:   2020-12-20 22:26:01 -0500
tags: recipes
---
{% endhighlight %}

## Finding the `_layout` folder in Minima's installation directory

First we need to find where Minima is installed. Run the command,  

{% highlight console %}
$ bundle info minima
{% endhighlight %}
Which should then output something similar to the following. What we will need is the directory path after `Path: `
{% highlight console %}
* minima (2.5.1)
        Summary: A beautiful, minimal theme for Jekyll.
        Homepage: https://github.com/jekyll/minima
        Path: /var/lib/gems/2.7.0/gems/minima-2.5.1
{% endhighlight %}

So now what we want to do is copy the `_layout` folder in this path into our root directory of our Jekyll project. Why? Because Jekyll will prioritize the `_layout` folder in our root project directory over the one in Minima's directory when building our website. So when we add buttons to our blog, they will actually show up.

First make sure you are in your Jekyll root directory then copy the `_layout` folder to it.

{% highlight console %}
$ cp -r /var/lib/gems/2.7.0/gems/minima-2.5.1/_layouts ./
{% endhighlight %}

Your project root directory should now have it's own copy of the Minima `_layout` folder. Below is an example of what your project structure should now look like.

{% highlight plaintext %}
blog-filter-tut(or whatever you named your project)/
├── _layouts/
├── _posts/
├── index.markdown
├── Gemfile
├── _config.yml
├── 404.html
└── about.markdown
{% endhighlight %}

## Adding some custom CSS to hide blog posts

Create a folder called `assets` in your project root directory then create a new scss file called `main.scss` inside `assets`.

{% highlight plaintext %}
blog-filter-tut(or whatever you named your project)/
├── assets/
│   └── main.scss
├── _layouts/
├── _posts/
├── index.markdown
├── Gemfile
├── _config.yml
├── 404.html
└── about.markdown
{% endhighlight %}

Open up `main.scss` in any text editor then add the following code into it.

{% highlight css %}
---
# We need these dashes here. Google "Front Matter" to learn more about them.
---

@import "minima";

.hidden {
    display: none;
}

.active-filter {
    background-color: #38c3ee5b;
    color: #222;
}
{% endhighlight %}

Now any HTML element with the class `hidden` will be hidden on our website. We will use this to hide blog posts that get filtered out. We will add the class `active-filter` to our buttons to make it easy to differentiate which filters are on and off.

## Adding the filtering buttons.

<strong>Example of a button we will make for each tag.</strong>
{% highlight html %}
  <button type="button" class="filter-button active-filter" value="tag-name">text on button</button>
{% endhighlight %}

Notice that the button has the class `active-filter` which we added styling rules to earlier in `main.scss`. In addition it also has the class `filter-button` which we will use to easily query our buttons in the filtering script we will write. You can also use this class to give the buttons permanent styles that aren't effected by whether the button is active or not.

You can put whatever text you want on your button but it is important that `value` is set verbatim to the tags you gave your blog posts in their `Front Matter`.

We will now add the buttons that toggle the filters for our blog posts. We will make one button per tag that we defined earlier in the Front Matter of our blog posts. The tags we made earlier are `opinion-pieces`, `recipes`, `movie-reviews`, and `daily-thoughts`. These are just examples, you'll of course add as many buttons as you need for the tags you use in your blog posts.

I want my buttons to show right before my blogs. To do this I need to add them in my file `home.html` inside the folder `_layouts`. I will add them right after the line that says `{% raw %}{{ content }}{% endraw %}`. You can play around with the positioning until they are where you want them.

{% highlight html %}
---
layout: default
---

<div class="home">
  {% raw %}{%- if page.title -%}{% endraw %}
    <h1 class="page-heading">{% raw %}{{page.title}}{% endraw %}</h1>
  {% raw %}{%- endif -%}{% endraw %}

  {% raw %}{{content}}{% endraw %}

  <!--our filter buttons-->
  <button type="button" class="filter-button active-filter" value="opinion-pieces">opinion pieces</button>
  <button type="button" class="filter-button active-filter" value="recipes">recipes</button>
  <button type="button" class="filter-button active-filter" value="movie-reviews">movie reviews</button>
  <button type="button" class="filter-button active-filter" value="daily-thoughts">daily thoughts</button>
  <!--our filter buttons-->

  {% raw %}{%- if site.posts.size > 0 -%}{% endraw %}
{% endhighlight %}

### Troubleshooting

If you ran into an `insufficient permissions` error when trying to save your changes to `home.html` then in your root directory, open up your console and run

{% highlight console %}
$ sudo chown -R $USER _layouts
{% endhighlight %}

This will give you ownership of the `_layouts` folder and the files in it.

## Add your tags as class names to your blogs

In `home.html` in your `_layouts` folder replace the `<li>` tag that corresponds with each individual blog post with `<li class="blog {% raw %}{{ post.tags | join: ' ' }}{% endraw %}">`. This will give each blog post class names that corresponds with their tags so we can filter them.

If you started following this tutorial from a new Jekyll project then the `<li>` you want to change is right after the `<ul>` with the class `post-list`.

<strong>Change this</strong>
{% highlight html %}
<ul class="post-list">
      {% raw %}{%- for post in site.posts -%}{% endraw %}
      <li>
{% endhighlight %}

<strong>To this</strong>
{% highlight html %}
<ul class="post-list">
      {% raw %}{%- for post in site.posts -%}{% endraw %}
      <li class="blog {% raw %}{{ post.tags | join: ' ' }}{% endraw %}">
{% endhighlight %}

### Finally, connect all the wires with Javascript

First link the Javascript we will write to `_layouts/home.html` at the very end of the file.

{% highlight html %}
---
layout: default
---

<div class="home">
   <!-- html omitted -->
</div>
<!-- link our javascript here -->
<script src="/assets/blog-filter.js"></script>
{% endhighlight %}

#### The Javascript

As you probably guessed, we will create a Javascript file called `log-filter.js` in our `assets` folder.

{% highlight console %}
$ touch ./assets/log-filter.js
{% endhighlight %}

Now add the following code into `log-filter.js` and you are done.

{% highlight javascript %}
const main = () => 
{
    let toggleState = {};
    let blogs = document.getElementsByClassName("blog");
    let filter_buttons = document.getElementsByClassName("filter-button");
    for(let filter_button of filter_buttons)
    {
        toggleState[filter_button.value] = true;
        filter_button.addEventListener('click', () => {
            tag = filter_button.value;
            toggleState[tag] = !toggleState[tag];
            toggleBlogs(tag, blogs, toggleState);
            filter_button.classList.toggle("active-filter");
        });
    }
}

const toggleBlogs = (tag, blogs, toggleState) =>
{
    for(blog of blogs)
    {
        if(blog.classList.contains(tag))
        {
            let skip = false;
            for(let curr_tag of blog.classList)
            {
                if(curr_tag != tag && toggleState[curr_tag] == false) skip = true;
            }
            if(!skip) blog.classList.toggle("hidden");
        }
    }
}

document.addEventListener('DOMContentLoaded', main)
{% endhighlight %}

You can go ahead and run `bundle exec jekyll serve` in your root project directory to build and serve the project locally.

After running `bundle exec jekyll serve`, you should see something like `Server address: http://000.0.0.0:0000//`

Just copy and paste whatever server address jekyll gives you into your internet browser of choice and see your filter buttons in action.

### Bugs to fix

- ~~These toggles blindly toggle the blogs and do not take into account what other toggles are active or not. This can lead to wacky behavior toggles no longer toggle the correct blogs. With a bit more mathematical rigor, this can be fixed. Will update with a fix when I find time.~~ Fixed!