class PhonemapsController < ApplicationController
  # GET /phonemaps
  # GET /phonemaps.xml
  def index
    @phonemaps = Phonemap.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @phonemaps }
    end
  end

  # GET /phonemaps/1
  # GET /phonemaps/1.xml
  def show
    @phonemap = Phonemap.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @phonemap }
    end
  end

  # GET /phonemaps/new
  # GET /phonemaps/new.xml
  def new
    @phonemap = Phonemap.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @phonemap }
    end
  end

  # GET /phonemaps/1/edit
  def edit
    @phonemap = Phonemap.find(params[:id])
  end

  # POST /phonemaps
  # POST /phonemaps.xml
  def create
    @phonemap = Phonemap.new(params[:phonemap])

    respond_to do |format|
      if @phonemap.save
        format.html { redirect_to(@phonemap, :notice => 'Phonemap was successfully created.') }
        format.xml  { render :xml => @phonemap, :status => :created, :location => @phonemap }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @phonemap.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /phonemaps/1
  # PUT /phonemaps/1.xml
  def update
    @phonemap = Phonemap.find(params[:id])

    respond_to do |format|
      if @phonemap.update_attributes(params[:phonemap])
        format.html { redirect_to(@phonemap, :notice => 'Phonemap was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @phonemap.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /phonemaps/1
  # DELETE /phonemaps/1.xml
  def destroy
    @phonemap = Phonemap.find(params[:id])
    @phonemap.destroy

    respond_to do |format|
      format.html { redirect_to(phonemaps_url) }
      format.xml  { head :ok }
    end
  end
end
