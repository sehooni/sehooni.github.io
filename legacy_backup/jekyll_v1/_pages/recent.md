---
title: "Recent Posts"
permalink: /recent/
layout: single
author_profile: true
---

<ul class="post-list" style="list-style: none; padding: 0;">
  {% for post in site.posts %}
    <li style="margin-bottom: 0.5em;">
      <span class="post-meta" style="color: #888; font-size: 0.9em; min-width: 100px; display: inline-block;">{{ post.date | date: "%Y-%m-%d" }}</span>
      <a href="{{ post.url | relative_url }}" style="font-weight: bold; font-size: 1.1em;">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
