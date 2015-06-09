class RestaurantCustomizationsController < ApplicationController
  # GET /restaurant_customizations
  # GET /restaurant_customizations.xml
  def index
    @restaurant_customizations = RestaurantCustomization.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @restaurant_customizations }
    end
  end

  # GET /restaurant_customizations/1
  # GET /restaurant_customizations/1.xml
  def show
    @restaurant_customization = RestaurantCustomization.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @restaurant_customization }
    end
  end

  # GET /restaurant_customizations/new
  # GET /restaurant_customizations/new.xml
  def new
    @restaurant_customization = RestaurantCustomization.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @restaurant_customization }
    end
  end

  # GET /restaurant_customizations/1/edit
  def edit
    @restaurant_customization = RestaurantCustomization.find(params[:id])
  end

  # POST /restaurant_customizations
  # POST /restaurant_customizations.xml
  def create
    @restaurant_customization = RestaurantCustomization.new(params[:restaurant_customization])

    respond_to do |format|
      if @restaurant_customization.save
        format.html { redirect_to(@restaurant_customization, :notice => 'RestaurantCustomization was successfully created.') }
        format.xml  { render :xml => @restaurant_customization, :status => :created, :location => @restaurant_customization }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @restaurant_customization.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /restaurant_customizations/1
  # PUT /restaurant_customizations/1.xml
  def update
    @restaurant_customization = RestaurantCustomization.find(params[:id])

    respond_to do |format|
      if @restaurant_customization.update_attributes(params[:restaurant_customization])
        format.html { redirect_to(@restaurant_customization, :notice => 'RestaurantCustomization was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @restaurant_customization.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /restaurant_customizations/1
  # DELETE /restaurant_customizations/1.xml
  def destroy
    @restaurant_customization = RestaurantCustomization.find(params[:id])
    @restaurant_customization.destroy

    respond_to do |format|
      format.html { redirect_to(restaurant_customizations_url) }
      format.xml  { head :ok }
    end
  end
end
