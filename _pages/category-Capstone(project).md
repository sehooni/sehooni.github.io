---
title: "Capstone"
layout: archive
permalink: categories/Capstone(project)
author_profile: true
sidebar_main: true
--- 


{% assign posts = site.categories.Capstone(project) %}
{% for post in posts %} {% include archive-single2.html type=page.entries_layout %} {% endfor %}
