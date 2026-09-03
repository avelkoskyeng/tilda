// Lunr's default trimmer is ASCII-oriented and can drop Cyrillic tokens.
// Replace it with a small Unicode-aware trimmer for Latin + Cyrillic docs.
if (!lunr.cpTplUnicodeTrimmer) {
  lunr.cpTplUnicodeTrimmer = function (token) {
    return token.update(function (value) {
      return value
        .replace(/^[^0-9A-Za-z\u0400-\u04FF]+/, '')
        .replace(/[^0-9A-Za-z\u0400-\u04FF]+$/, '');
    });
  };

  lunr.Pipeline.registerFunction(lunr.cpTplUnicodeTrimmer, 'cpTplUnicodeTrimmer');
}

if (!this.cpTplUnicodePipelineConfigured) {
  if (this.pipeline && lunr.trimmer) {
    this.pipeline.before(lunr.trimmer, lunr.cpTplUnicodeTrimmer);
    this.pipeline.remove(lunr.trimmer);
  }

  // Search pipeline normally contains the stemmer only; trim query tokens too
  // so punctuation behaves the same during indexing and searching.
  if (this.searchPipeline && lunr.stemmer) {
    this.searchPipeline.before(lunr.stemmer, lunr.cpTplUnicodeTrimmer);
  }

  this.cpTplUnicodePipelineConfigured = true;
}

var cpTplAliases = docs[i].search_aliases || {};
var cpTplRelUrl = docs[i].relUrl || docs[i].url || '';
var cpTplHashIndex = cpTplRelUrl.indexOf('#');
var cpTplSectionId = cpTplHashIndex === -1 ? '' : cpTplRelUrl.slice(cpTplHashIndex + 1);
var cpTplSectionAliases = cpTplSectionId && cpTplAliases[cpTplSectionId]
  ? cpTplAliases[cpTplSectionId]
  : '';

if (Array.isArray(cpTplSectionAliases)) {
  cpTplSectionAliases = cpTplSectionAliases.join(' ');
}

var cpTplSearchContent = [
  docs[i].content,
  docs[i].search_keywords,
  cpTplSectionAliases
];

docs[i].content = cpTplSearchContent.filter(Boolean).join(' ');
