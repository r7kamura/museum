class PicturesController < ApplicationController
  def index
    @pictures = Picture.order("id DESC")
  end

  def new
  end

  def create
    Picture.create(:data => params[:data])
    render :nothing => true
  end
end
