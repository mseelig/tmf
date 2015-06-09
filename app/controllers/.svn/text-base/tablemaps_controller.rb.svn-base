class TablemapsController < ApplicationController
  # GET /tablemaps
  # GET /tablemaps.xml
  def index
    @tablemaps = Tablemap.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @tablemaps }
    end
  end

  # GET /tablemaps/1
  # GET /tablemaps/1.xml
  def show
    @tablemap = Tablemap.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @tablemap }
    end
  end

  # GET /tablemaps/new
  # GET /tablemaps/new.xml
  def new
    @tablemap = Tablemap.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @tablemap }
    end
  end

  # GET /tablemaps/1/edit
  def edit
    @tablemap = Tablemap.find(params[:id])
  end

  # POST /tablemaps
  # POST /tablemaps.xml
  def create
    @tablemap = Tablemap.new(params[:tablemap])

    respond_to do |format|
      if @tablemap.save
        format.html { redirect_to(@tablemap, :notice => 'Tablemap was successfully created.') }
        format.xml  { render :xml => @tablemap, :status => :created, :location => @tablemap }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @tablemap.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /tablemaps/1
  # PUT /tablemaps/1.xml
  def update
    @tablemap = Tablemap.find(params[:id])

    respond_to do |format|
      if @tablemap.update_attributes(params[:tablemap])
        format.html { redirect_to(@tablemap, :notice => 'Tablemap was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @tablemap.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /tablemaps/1
  # DELETE /tablemaps/1.xml
  def destroy
    @tablemap = Tablemap.find(params[:id])
    @tablemap.destroy

    respond_to do |format|
      format.html { redirect_to(tablemaps_url) }
      format.xml  { head :ok }
    end
  end
end
