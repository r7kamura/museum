class PicturesController < ApplicationController
  def index
    @pictures = Picture.order("id DESC").limit(20)
  end

  def show
    @picture = Picture.find(params[:id])
  end

  def create
    Picture.create(:data => params[:data])
    render :nothing => true
  end
end
