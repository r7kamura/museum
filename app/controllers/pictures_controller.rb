class PicturesController < ApplicationController
  def index
    @pictures = Picture.order("id DESC").limit(20)
  end

  def show
    @picture = Picture.find(params[:id])
  end

  def new
  end

  def create
    Picture.create([ params[:data] ].flatten.map { |data| {:data => data} })
    redirect_to :root
  end
end
