# based on https://distresssignal.org/busting-css-cache-with-jekyll-md5-hash
# https://gist.github.com/BryanSchuetz/2ee8c115096d7dd98f294362f6a667db
module Jekyll
  module CacheBust
    class CacheDigester
      require 'digest/md5'
      def initialize(file_name:, sources:)
        @file_name = file_name
        @sources = sources
      end

      def digest!
        digest = Digest::MD5.new
        @sources.each { |source| digest.update(File.binread(source)) }
        "#{@file_name}?#{digest.hexdigest}"
      end
    end

    def bust_file_cache(file_name)
      source = file_name.slice((file_name.index('assets/')..-1))
      CacheDigester.new(file_name: file_name, sources: [source]).digest!
    end

    def bust_css_cache(file_name)
      sources = ['assets/css/main.scss', '_config.yml'] + Dir.glob('_sass/**/*.{scss,sass}')
      CacheDigester.new(file_name: file_name, sources: sources).digest!
    end
  end
end

Liquid::Template.register_filter(Jekyll::CacheBust)
