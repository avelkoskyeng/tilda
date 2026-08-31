var cpTplSearchContent = [docs[i].content, docs[i].search_keywords];
docs[i].content = cpTplSearchContent.filter(Boolean).join(' ');
