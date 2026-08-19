#!/usr/bin/env ruby

require "cgi"
require "fileutils"
require "nokogiri"
require "open-uri"
require "time"
require "yaml"

scholar_id = ENV.fetch("GOOGLE_SCHOLAR_ID", "KXOvopEAAAAJ")
output_path = ENV.fetch(
  "GOOGLE_SCHOLAR_OUTPUT",
  File.expand_path("../_data/google_scholar.yml", __dir__),
)
profile_url = "https://scholar.google.com/citations?user=#{CGI.escape(scholar_id)}&hl=en&sortby=pubdate&pagesize=100"

begin
  html = URI.open(
    profile_url,
    "User-Agent" => "Mozilla/5.0 (compatible; academic-homepage-citation-refresh/1.0)",
    "Accept-Language" => "en-US,en;q=0.9",
    open_timeout: 20,
    read_timeout: 30,
  ).read

  if html.match?(/unusual traffic|not a robot|recaptcha/i)
    raise "Google Scholar returned an automated-traffic challenge"
  end

  document = Nokogiri::HTML(html)
  rows = document.css("tr.gsc_a_tr")
  raise "Google Scholar returned no publication rows" if rows.empty?

  publications = rows.filter_map do |row|
    title_link = row.at_css("a.gsc_a_at")
    citation_id = title_link&.[]("href")&.match(/citation_for_view=([^&]+)/)&.captures&.first
    next unless title_link && citation_id

    citation_text = row.at_css(".gsc_a_ac")&.text.to_s.delete(",").strip
    {
      "id" => CGI.unescape(citation_id),
      "title" => title_link.text.strip,
      "citations" => citation_text.empty? ? 0 : Integer(citation_text, 10),
    }
  end
  raise "Google Scholar rows did not contain citation identifiers" if publications.empty?

  total_text = document.at_css("td.gsc_rsb_std")&.text.to_s.delete(",").strip
  snapshot = {
    "profile_id" => scholar_id,
    "updated_at" => Time.now.utc.iso8601,
    "total_citations" => total_text.empty? ? nil : Integer(total_text, 10),
    "publications" => publications,
  }

  FileUtils.mkdir_p(File.dirname(output_path))
  temporary_path = "#{output_path}.tmp"
  File.write(temporary_path, YAML.dump(snapshot))
  File.rename(temporary_path, output_path)
  puts "Updated #{publications.length} Google Scholar records in #{output_path}"
rescue StandardError => error
  warn "Google Scholar refresh failed: #{error.message}"
  warn "The existing citation snapshot was left unchanged."
  exit 1
end
