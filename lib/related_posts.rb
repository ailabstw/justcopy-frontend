module Jekyll
  class RelatedPosts
    class << self
      attr_accessor :lsi
    end

    attr_reader :post, :site

    def initialize(post)
      @post = post
      @site = post.site
      Jekyll::External.require_with_graceful_fail("classifier-reborn")
    end

    def build
      return [] unless site.posts.docs.size > 1
      if site.lsi
        # puts 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'
        build_index
        lsi_related_posts
      else
        most_recent_posts
      end
    end

    def build_index
      self.class.lsi ||= begin
        lsi = Hash.new
        # lsi = ClassifierReborn::LSI.new(:auto_rebuild => false)
        Jekyll.logger.info("Populating LSI...")

        site.posts.docs.each do |x|
          #puts 'post: title ' + x['title']
          if x.data['categories'].length < 2
            next
          end
          category = x.data['categories'][1]
          #puts 'category: ' + category
          if not lsi.key?(category)
            lsi[category] = ClassifierReborn::LSI.new(:auto_rebuild => false)
          end
          lsi[category].add_item(x){
            |x| 
            if x['key_sentence']
                # puts 'use key'
                next x['key_sentence']
            else
                next x.to_s
            end
          }
        end

        Jekyll.logger.info("Rebuilding index...")
        keys = lsi.keys
        keys.each{ |key|
          puts 'building ' + key
          lsi[key].build_index
        }
        Jekyll.logger.info("done")
        lsi
      end
    end

    def lsi_related_posts
      # puts 'finding related post..'
      category = post.data['categories'][1]
      #puts 'category: ' + categories
      begin
        return self.class.lsi[category].find_related(post, 5){
            |x| 
            if x['key_sentence']
                next x['key_sentence']
            else
                next x.to_s
            end
        }
      rescue
        return []
      end
#      self.class.lsi.find_related(post, 11)
    end

    def most_recent_posts
      @most_recent_posts ||= (site.posts.docs.reverse - [post]).first(10)
    end
  end
end        
