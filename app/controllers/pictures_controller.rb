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
    @picture = Picture.create(:data => params[:data])
    redirect_to :root
  end
end
