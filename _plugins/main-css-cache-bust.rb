module MainCssCacheBust
  require 'digest/md5'

  def bust_main_css_cache(file_name)
    site = @context.registers[:site] if defined?(@context) && @context
    source = site ? site.source : Dir.pwd
    paths = [File.join(source, 'assets/css/main.scss')]
    paths += Dir[File.join(source, '_sass', '**', '*.scss')]
    digest = Digest::MD5.hexdigest(paths.sort.map { |path| File.read(path) }.join)

    "#{file_name}?v=#{digest}"
  end
end

Liquid::Template.register_filter(MainCssCacheBust)
