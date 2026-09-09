# frozen_string_literal: true

module ThirdPartyLibraryVersions
  PLACEHOLDER = "{{version}}"

  def self.expand(value, version, library_name)
    case value
    when String
      return value unless value.include?(PLACEHOLDER)

      if version.nil? || version.to_s.empty?
        raise Jekyll::Errors::FatalException,
              "third_party_libraries.#{library_name}.url contains #{PLACEHOLDER}, but no version is configured"
      end

      value.gsub(PLACEHOLDER, version.to_s)
    when Hash
      value.transform_values { |nested_value| expand(nested_value, version, library_name) }
    when Array
      value.map { |nested_value| expand(nested_value, version, library_name) }
    else
      value
    end
  end
end

Jekyll::Hooks.register :site, :after_init do |site|
  libraries = site.config["third_party_libraries"]
  next unless libraries.is_a?(Hash)

  if libraries["download"] == true
    raise Jekyll::Errors::FatalException,
          "third_party_libraries.download: true is not supported; keep it false to load libraries from their configured CDN URLs"
  end

  libraries.each do |library_name, library|
    next if library_name == "download" || !library.is_a?(Hash) || !library.key?("url")

    library["url"] = ThirdPartyLibraryVersions.expand(library["url"], library["version"], library_name)
  end
end
