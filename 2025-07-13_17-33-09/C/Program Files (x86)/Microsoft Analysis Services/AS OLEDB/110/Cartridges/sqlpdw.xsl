<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt" version="1.0" xmlns:mssqlcrt="urn:sql-microsoft-com:sqlcrt" xmlns:mssqldbg="urn:sql-microsoft-com:sqldbg">
	<xsl:output method="xml" indent="yes"/>

	<!-- This ALWAYS GENERATED file contains the definitions for the cartridges
	             Microsoft Cartridge Interfaces (Analysis Services 2005)
	             (C) Copyright 1988 - 2003 By Microsoft Corporation.      -->


	<!-- Area of Custom parametrizations: these may be modified by customers for specific query customizations  -->
	<!-- post-select-query-hint will append the customer-defined string at the end of the generated SELECT statement - e.g. WITH UR -->
	<xsl:param name="post-select-query-hint"></xsl:param>


	<!-- SQL Server Parallel Data Warehouse pluggable cartridge           -->

	<!-- Area of STANDARD parametrizations: these are externally passed   -->
	<xsl:param name="in_CanUseParams">yes</xsl:param>
	<xsl:param name="in_IdentStartQuotingCharacter">[</xsl:param>
	<xsl:param name="in_IdentEndQuotingCharacter">]</xsl:param>
	<xsl:param name="in_StringStartQuotingCharacter">'</xsl:param>
	<xsl:param name="in_StringEndQuotingCharacter">'</xsl:param>
	
	<!-- Area of CORE parametrizations: These are externally checked      -->
	<mssqlcrt:provider type="prefix" managed="yes" native="yes">Microsoft SQL Server Parallel Data Warehouse</mssqlcrt:provider>
	<mssqlcrt:provider type="prefix" managed="yes" native="yes">Microsoft SQL Server 2008 R2 Parallel Data Warehouse</mssqlcrt:provider>
	<mssqlcrt:provider type="prefix" managed="yes" native="yes">Datallegro</mssqlcrt:provider>
	<mssqlcrt:provider type="prefix" managed="yes" native="yes">SQL Server 2012 Parallel Data Warehouse</mssqlcrt:provider>
	<mssqlcrt:parameter-style native="unnamed" managed="unnamed"/>

	<mssqlcrt:capabilities>
		<mssqlcrt:supports-datepart-year/>
		<mssqlcrt:supports-datepart-quarter/>
		<mssqlcrt:supports-datepart-month/>
		<mssqlcrt:supports-datepart-dayofyear/>
		<mssqlcrt:supports-datepart-day/>
		<mssqlcrt:supports-datepart-week/>
		<mssqlcrt:supports-datepart-dayofweek/>
		<mssqlcrt:supports-datepart-hour/>
		<mssqlcrt:supports-datepart-minute/>
		<mssqlcrt:supports-datepart-second/>
		<mssqlcrt:supports-datepart-millisecond/>
		<mssqlcrt:supports-subselect/>
		<mssqlcrt:supports-table-alias/>
		<mssqlcrt:supports-column-alias/>
		<mssqlcrt:supports-top-clause/>
		<mssqlcrt:supports-union/>
		<mssqlcrt:supports-union-all/>
		<mssqlcrt:supports-cast/>
		<mssqlcrt:supports-joins/>
		<mssqlcrt:supports-apply/>
		<mssqlcrt:supports-distinct-count/>
		<mssqlcrt:limit-table-identifier-length>32</mssqlcrt:limit-table-identifier-length>
		<mssqlcrt:limit-column-identifier-length>32</mssqlcrt:limit-column-identifier-length>

		<!-- Map from MSDAInitialize connection string to SQLOLEDB connection string -->
		<mssqlcrt:remote-connection-string-mappings>
			<mssqlcrt:remote-connection-string-mapping>
				<mssqlcrt:datasource-property>Provider</mssqlcrt:datasource-property>
				<mssqlcrt:remote-property></mssqlcrt:remote-property>
			</mssqlcrt:remote-connection-string-mapping>
			<mssqlcrt:remote-connection-string-mapping>
				<mssqlcrt:datasource-property>Data Source</mssqlcrt:datasource-property>
				<mssqlcrt:remote-property>Server</mssqlcrt:remote-property>
			</mssqlcrt:remote-connection-string-mapping>
			<mssqlcrt:remote-connection-string-mapping>
				<mssqlcrt:datasource-property>Initial Catalog</mssqlcrt:datasource-property>
				<mssqlcrt:remote-property>Database</mssqlcrt:remote-property>
			</mssqlcrt:remote-connection-string-mapping>
			<mssqlcrt:remote-connection-string-mapping>
				<mssqlcrt:datasource-property>User ID</mssqlcrt:datasource-property>
				<mssqlcrt:remote-property>UID</mssqlcrt:remote-property>
			</mssqlcrt:remote-connection-string-mapping>
			<mssqlcrt:remote-connection-string-mapping>
				<mssqlcrt:datasource-property>Password</mssqlcrt:datasource-property>
				<mssqlcrt:remote-property>PWD</mssqlcrt:remote-property>
			</mssqlcrt:remote-connection-string-mapping>
			<mssqlcrt:remote-connection-string-mapping>
				<mssqlcrt:datasource-property>Integrated Security=SSPI</mssqlcrt:datasource-property>
				<mssqlcrt:remote-property>Trusted_Connection=yes</mssqlcrt:remote-property>
			</mssqlcrt:remote-connection-string-mapping>
		</mssqlcrt:remote-connection-string-mappings>
	</mssqlcrt:capabilities>

	<mssqlcrt:schema-classes>
		<mssqlcrt:schema-class>
		    <mssqlcrt:managed-provider>Microsoft.SqlServer.DataWarehouse</mssqlcrt:managed-provider>
		    <mssqlcrt:type>Microsoft.DataWarehouse.Design.SqlSchema, Microsoft.DataWarehouse</mssqlcrt:type>
		    <mssqlcrt:query-designer>
			    <mssqlcrt:type>Microsoft.DataWarehouse.Controls.SqlClientQueryDesigner, Microsoft.DataWarehouse</mssqlcrt:type>
		    </mssqlcrt:query-designer>
		</mssqlcrt:schema-class>
		<mssqlcrt:schema-class>
		    <mssqlcrt:managed-provider>System.Data.OleDb</mssqlcrt:managed-provider>
		    <mssqlcrt:type>Microsoft.DataWarehouse.Design.SqlSchema, Microsoft.DataWarehouse</mssqlcrt:type>
		    <mssqlcrt:query-designer>
			    <mssqlcrt:type>Microsoft.DataWarehouse.Controls.OleDbQueryDesigner, Microsoft.DataWarehouse</mssqlcrt:type>
		    </mssqlcrt:query-designer>
		</mssqlcrt:schema-class>
		<mssqlcrt:schema-class>
		    <mssqlcrt:managed-provider>System.Data.Odbc</mssqlcrt:managed-provider>
		    <mssqlcrt:type>Microsoft.DataWarehouse.Design.OdbcSchema, Microsoft.DataWarehouse</mssqlcrt:type>
		</mssqlcrt:schema-class>
	</mssqlcrt:schema-classes>
	<!-- Area of internal parametrizations                                -->
	<!-- overrideOfUseParams:
	         yes      = use always parametric queries
	         no       = never use parametric queries
			 nosubsel = use as yes, but not on subselects
			 auto     = use the value of in_CanUseParams to determine     -->
	<xsl:variable name="overrideOfUseParams">auto</xsl:variable>
	<!-- shouldProduceDebug:
	         yes      = produce debug information
	         no       = do not produce debug information                  -->
	<xsl:variable name="shouldProduceDebug">yes</xsl:variable>

	<!-- Area of global variables initializations                         -->
	<xsl:variable name="UseParams">
		<xsl:choose>
			<xsl:when test="normalize-space($overrideOfUseParams) = 'yes' or (normalize-space($overrideOfUseParams) = 'auto' and normalize-space($in_CanUseParams)='yes')">yes</xsl:when>
			<xsl:when test="normalize-space($overrideOfUseParams) = 'nosubsel'">nosubsel</xsl:when>
			<xsl:otherwise>no</xsl:otherwise>
		</xsl:choose>
	</xsl:variable>
	<xsl:variable name="ProduceDebug" select="$shouldProduceDebug"/>
	<xsl:variable name="IdentifierStartQuotingCharacter" select="normalize-space($in_IdentStartQuotingCharacter)"/>
	<xsl:variable name="IdentifierEndQuotingCharacter" select="normalize-space($in_IdentEndQuotingCharacter)"/>
	<xsl:variable name="StringStartQuotingCharacter" select="normalize-space($in_StringStartQuotingCharacter)"/>
	<xsl:variable name="StringEndQuotingCharacter" select="normalize-space($in_StringEndQuotingCharacter)"/>

	<!-- Generated statement packaging                                    -->
	<xsl:template match="/">
		<xsl:element name="Statement">

			<!-- Generate query                                           -->
			<xsl:element name="Text">
				<xsl:apply-templates select="./Statement/*[1]"/>
			</xsl:element>

			<!-- Generate parameters                                      -->
			<xsl:if test="count(./Statement/Parameters/Parameter)!=0 and ((normalize-space($UseParams)='yes') or (normalize-space($UseParams)='nosubsel'))">
				<xsl:element name="Parameters">
					<xsl:choose>
						<xsl:when test="/Statement/*[1]//Parameter/@ParamName">
							<xsl:for-each select="./Statement/Parameters/Parameter">
								<xsl:element name="Parameter">
									<xsl:attribute name="ref">
										<xsl:value-of select="./@id"/>
									</xsl:attribute>
								</xsl:element>
							</xsl:for-each>
						</xsl:when>
						<xsl:otherwise>
							<xsl:for-each select="./Statement/*[1]//Parameter">
								<xsl:element name="Parameter">
									<xsl:attribute name="ref">
										<xsl:value-of select="./@ref"/>
									</xsl:attribute>
								</xsl:element>
							</xsl:for-each>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:element>
			</xsl:if>

			<!-- Generate debug info                                      -->
			<xsl:if test="$ProduceDebug='yes'">
				<xsl:element name="mssqldbg:DebugInfo">
					<xsl:element name="mssqldbg:GenerateParametricInfo">
						<xsl:attribute name="mssqldbg:Value">
							<xsl:value-of select="$UseParams"/>
						</xsl:attribute>
						<xsl:element name="mssqldbg:External">
							<xsl:value-of select="$in_CanUseParams"/>
						</xsl:element>
						<xsl:element name="mssqldbg:Internal">
							<xsl:value-of select="$overrideOfUseParams"/>
						</xsl:element>
					</xsl:element>
				</xsl:element>
			</xsl:if>

		</xsl:element>
	</xsl:template>

	<!-- Union statement                                                  -->
	<xsl:template match="Union">
		<xsl:if test="name(..) != 'Statement' and name(..) != 'Insert'">
			(
		</xsl:if>
			<xsl:call-template name="print-children-list">
				<xsl:with-param name="operator" select="' UNION '"/>
			</xsl:call-template>
		<xsl:if test="name(..) != 'Statement' and name(..) != 'Insert'">
			)
		</xsl:if>
	</xsl:template>

	<!-- Union All statement                                                  -->
	<xsl:template match="UnionAll">
		<xsl:if test="name(..) != 'Statement' and name(..) != 'Insert'">
			(
		</xsl:if>
			<xsl:call-template name="print-children-list">
				<xsl:with-param name="operator" select="' UNION ALL '"/>
			</xsl:call-template>
		<xsl:if test="name(..) != 'Statement' and name(..) != 'Insert'">
			)
		</xsl:if>
	</xsl:template>

	<!-- Top clause																											 -->
	<xsl:template match="Top">
    TOP (<xsl:apply-templates select="./*[1]"/>) <xsl:apply-templates select="./TopPercent"/> <xsl:apply-templates select="./TopWithTies"/>
  </xsl:template>

	<xsl:template match="TopPercent">
		PERCENT
	</xsl:template>

	<xsl:template match="TopWithTies">
		WITH TIES
	</xsl:template>

	<!-- Select statement                                                 -->
	<xsl:template match="Select">
		<xsl:if test="name(..) != 'Statement' and name(..) != 'Insert' and name(..) != 'Union' and name(..) != 'UnionAll'">
			(
		</xsl:if>
		SELECT <xsl:apply-templates select="./Top"/>
			<xsl:apply-templates select="./Distinct"/>
			<xsl:apply-templates select="./ColumnExpressions"/>
			<xsl:apply-templates select="./Sources"/>
			<xsl:apply-templates select="./Where"/>
			<xsl:apply-templates select="./GroupBy"/>
			<xsl:apply-templates select="./Having"/>
			<xsl:apply-templates select="./OrderBy"/>
		
			<xsl:if test="name(..) = 'Statement'">
				<xsl:text> </xsl:text><xsl:value-of select="$post-select-query-hint"/>
			</xsl:if>
		<xsl:if test="name(..) != 'Statement' and name(..) != 'Insert' and name(..) != 'Union' and name(..) != 'UnionAll'">
			)
		</xsl:if>
	</xsl:template>

	<!-- Singleton clause                                                       -->
	<xsl:template match="Singleton">
		(SELECT <xsl:apply-templates select="./ColumnExpressions"/>
		FROM DUAL
		<xsl:text> 
                ) </xsl:text>
	</xsl:template>

	<xsl:template match="Distinct">
		DISTINCT
	</xsl:template>

	<xsl:template match="As">
		<xsl:apply-templates select="./*[1]"/> AS <xsl:apply-templates select="./*[2]"/>
	</xsl:template>

	<xsl:template match="Sources">
		FROM <xsl:choose>
              		<xsl:when test="count(./Join) != 0 or count(./Apply) != 0 or count(./CrossJoin)!= 0">
                		   <xsl:apply-templates select="./Join"/>
				               <xsl:apply-templates select="./Apply"/>
                       <xsl:apply-templates select="./CrossJoin"/>
              		</xsl:when>
              		<xsl:otherwise>
                		   <xsl:call-template name="print-children-list"/>
              		</xsl:otherwise>
          	     </xsl:choose>
	</xsl:template>

    <xsl:template match="Join">
      (<xsl:apply-templates select="./*[2]"/><xsl:call-template name="JoinType"/> <xsl:apply-templates select="./*[3]"/> on <xsl:apply-templates select="./On/*"/>)
    </xsl:template>

    <xsl:template name="JoinType">
      <xsl:variable name="value-node">
        <xsl:value-of select="normalize-space(./JoinType/text())"/>
      </xsl:variable>
      <xsl:choose>
        <xsl:when test="$value-node = 'LeftOuterJoin'">        left outer join        </xsl:when>
        <xsl:when test="$value-node = 'RightOuterJoin'">       right outer join        </xsl:when>
        <xsl:when test="$value-node = 'FullOuterJoin'">        full outer join        </xsl:when>
        <xsl:when test="$value-node = 'InnerJoin'">            inner join        </xsl:when>
      </xsl:choose>
    </xsl:template>

    <xsl:template match="CrossJoin">
      <xsl:apply-templates select="./*[1]"/> Cross Join <xsl:apply-templates select="./*[2]"/>
    </xsl:template>

  <xsl:template match="Apply">
    (
      <xsl:apply-templates select="./*[2]"/>
      <xsl:call-template name="ApplyType"/>
      <xsl:apply-templates select="./*[3]"/>
    )
  </xsl:template>

  <xsl:template name="ApplyType">
    <xsl:variable name="value-node">
      <xsl:value-of select="normalize-space(./ApplyType/text())"/>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="$value-node = 'CrossApply'">        cross apply        </xsl:when>
      <xsl:when test="$value-node = 'OuterApply'">        outer apply        </xsl:when>
    </xsl:choose>
  </xsl:template>


	<xsl:template match="ColumnDefinitions">
		<xsl:call-template name="print-children-list"/>
	</xsl:template>

	<xsl:template match="GroupBy">
		GROUP BY <xsl:call-template name="print-children-list"/>
	</xsl:template>

	<xsl:template match="OrderBy">
		ORDER BY <xsl:call-template name="print-children-list"/>
	</xsl:template>

	<xsl:template match="Where">
		WHERE <xsl:apply-templates select="./*"/>
	</xsl:template>

	<xsl:template match="Exists">
		EXISTS (<xsl:apply-templates select="./*"/>)
	</xsl:template>

	<xsl:template match="Having">
		HAVING <xsl:apply-templates select="./*"/>
	</xsl:template>

	<xsl:template match="ColumnExpressions">
		<xsl:call-template name="print-children-list"/>
	</xsl:template>

	<xsl:template match="SQLColumn">
		<xsl:variable name="table">
			<xsl:if test="name(..)!='Count' or name(./Column/*[1]) != 'Asterisk'"><xsl:apply-templates select="./Table"/></xsl:if>
		</xsl:variable>
		<xsl:variable name="column">
			<xsl:apply-templates select="./Column"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="$table = ''">
				<xsl:value-of select="$column"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="concat($table,'.', $column)"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="Table">
		<xsl:call-template name="build-quoted-schema-object"/>
	</xsl:template>

	<xsl:template match="View">
		<xsl:call-template name="build-quoted-schema-object"/>
	</xsl:template>

	<xsl:template match="Index">
		<xsl:apply-templates select="./Name"/>
	</xsl:template>

	<xsl:template match="Column">
		<xsl:apply-templates select="./Asterisk"/>
		<xsl:apply-templates select="./Name"/>
		<xsl:apply-templates select="./Null"/>
	</xsl:template>

	<!-- Null                                                         -->
	<xsl:template match="Null">null</xsl:template>

	<xsl:template match="Table/Name|View/Name|Index/Name|Column/Name|Database/Name|Schema">
		<xsl:call-template name="quote-identifier"/>
	</xsl:template>

	<xsl:template match="Usage">
		<xsl:variable name="usage"><xsl:value-of select="."/></xsl:variable>
		<xsl:choose>
			<xsl:when test="$usage = 'Key'">    primary key   </xsl:when>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="OpaqueExpression">
		<xsl:if test="name(..) = 'As' and name(../..) = 'Sources'">
			(
		</xsl:if>
		<xsl:value-of select="."/>
		<xsl:if test="name(..) = 'As' and name(../..) = 'Sources'">
			)
		</xsl:if>
	</xsl:template>

	<xsl:template match="OrderExpression">
		<xsl:apply-templates select="./*[1]"/>
		<xsl:apply-templates select="./Asc"/>
		<xsl:apply-templates select="./Desc"/>
	</xsl:template>

	<!--OpOrderExpression-->
	<!--Child nodes here should never contain parameter passed into query, except the case when Op1Type = 'SqlBool'.-->
	<xsl:template match="OpOrderExpression">
		<xsl:choose>
			<xsl:when test="@Op1Type = 'SqlBool'">
				<xsl:call-template name="OpCast">
					<xsl:with-param name="param-type" select="'SqlBool'"/>
					<xsl:with-param name="target-type" select="'SqlBit'"/>
					<xsl:with-param name="value-node" select="./*[1]"/>
				</xsl:call-template>
				<xsl:apply-templates select="./Asc"/>
				<xsl:apply-templates select="./Desc"/>
			</xsl:when>
			<xsl:when test="@Op1Nullable = 'false' or @Op1Type = 'String'">
				<xsl:apply-templates select="./*[1]"/>
				<xsl:apply-templates select="./Asc"/>
				<xsl:apply-templates select="./Desc"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:choose>
					<xsl:when test="@Op1Type = 'Datetime'">
						ISNULL(<xsl:apply-templates select="./*[1]"/>, CAST(-2 AS datetime))
					</xsl:when>
					<xsl:otherwise>
						ISNULL(<xsl:apply-templates select="./*[1]"/>, 0)
					</xsl:otherwise>
				</xsl:choose>
				<xsl:apply-templates select="./Asc"/>
				<xsl:apply-templates select="./Desc"/>
				, (CASE WHEN <xsl:apply-templates select="./*[1]"/> IS NULL THEN 0 ELSE 1 END)
				<xsl:apply-templates select="./Asc"/>
				<xsl:apply-templates select="./Desc"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="Asc">
		ASC
	</xsl:template>

	<xsl:template match="Desc">
		DESC
	</xsl:template>

	<!-- Print values: ? for parametric queries and convert expressions
	     for non-parametric queries                                       -->
	<xsl:template match="Parameter">
		<xsl:choose>
			<xsl:when test="$UseParams = 'yes' or $UseParams = 'nosubsel'">
				<xsl:choose>
					<xsl:when test="./@ParamName">
						@<xsl:value-of select="./@ParamName"/>
					</xsl:when>
					<xsl:otherwise>
						?
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:otherwise>
				<xsl:call-template name="print-non-parametric-parameter-ref">
					<xsl:with-param name="parameter-reference" select="."/>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- DatePart                                                         -->
	<xsl:template match="DatePart">
		DATEPART( <xsl:apply-templates select="./*[1]"/> , <xsl:apply-templates select="./*[2]"/> )
	</xsl:template>

	<!-- DatePartSpec                                                     -->
	<xsl:template match="DatePartSpec">
		<xsl:variable name="dps-val"><xsl:value-of select="normalize-space(./text())"/></xsl:variable>
		<xsl:choose>
			<xsl:when test="$dps-val = 'Year'">        year        </xsl:when>
			<xsl:when test="$dps-val = 'Quarter'">     quarter     </xsl:when>
			<xsl:when test="$dps-val = 'Month'">       month       </xsl:when>
			<xsl:when test="$dps-val = 'DayOfYear'">   dayofyear   </xsl:when>
			<xsl:when test="$dps-val = 'Day'">         day         </xsl:when>
			<xsl:when test="$dps-val = 'Week'">        week        </xsl:when>
			<xsl:when test="$dps-val = 'DayOfWeek'">   weekday     </xsl:when>
			<xsl:when test="$dps-val = 'Hour'">        hour        </xsl:when>
			<xsl:when test="$dps-val = 'Minute'">      minute      </xsl:when>
			<xsl:when test="$dps-val = 'Second'">      second      </xsl:when>
			<xsl:when test="$dps-val = 'Millisecond'"> millisecond </xsl:when>
		</xsl:choose>
	</xsl:template>

	<!-- Asterisk                                                         -->
	<xsl:template match="Asterisk">*</xsl:template>

	<!-- Count/Min/Max/Sum                                                -->
	<xsl:template match="Min|Max|Sum">
		<xsl:variable name="function">
			<xsl:choose>
				<xsl:when test="name()='Min'"> MIN </xsl:when>
				<xsl:when test="name()='Max'"> MAX </xsl:when>
				<xsl:when test="name()='Sum'"> SUM </xsl:when>
			</xsl:choose>
		</xsl:variable>
		<xsl:value-of select="$function"/>( <xsl:apply-templates select="./*[1]"/> )
	</xsl:template>

	<xsl:template match="Count">
		COUNT ( <xsl:apply-templates select="./*[1]"/> <xsl:apply-templates select="./*[2]"/> )
	</xsl:template>


  <!-- /Stdev/Stdevp/Var/Varp/Avg                                         -->
	<xsl:template match="Stdev|Stdevp|Var|Varp|Avg">
		<xsl:variable name="function">
			<xsl:choose>
				<xsl:when test="name()='Stdev'"> STDEV </xsl:when>
				<xsl:when test="name()='Stdevp'"> STDEVP </xsl:when>
				<xsl:when test="name()='Var'"> VAR </xsl:when>
				<xsl:when test="name()='Varp'"> VARP </xsl:when>
				<xsl:when test="name()='Avg'"> AVG </xsl:when>
			</xsl:choose>
		</xsl:variable>
		<xsl:value-of select="$function"/>( <xsl:apply-templates select="./*[1]"/> )
	</xsl:template>

	<!-- TableToScalar -->
	<xsl:template match="OpTableToScalar">
		<xsl:choose>
			<xsl:when test="@Op1Nullable = 'false'">
				((SELECT MIN(<xsl:apply-templates select="./*[1]"/>)) UNION (SELECT MAX(<xsl:apply-templates select="./*[1]"/>)))
			</xsl:when>
			<xsl:otherwise>
				(CASE WHEN COUNT_BIG(*) = COUNT_BIG(<xsl:apply-templates select="./*[1]"/>) THEN ((SELECT MIN(<xsl:apply-templates select="./*[1]"/>)) UNION (SELECT MAX(<xsl:apply-templates select="./*[1]"/>))) ELSE ((SELECT MIN(<xsl:apply-templates select="./*[1]"/>)) UNION (SELECT NULL)) END)
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- CountBlank -->
	<xsl:template match="OpCountBlank">
		SUM(CASE WHEN (<xsl:apply-templates select="./*[1]"/>) IS NULL THEN CAST(1 AS BIGINT) END)
	</xsl:template>

	<!-- CountSubqueryRows -->
	<!-- Note that this operator, unlike OpCount and OpCountBlank, does not return NULL when count is 0. -->
	<!-- Currently this operator is used internally and its result is assumed to be not NULL. -->
	<!-- SQL Server 2005 and 2008 crash badly on COUNT_BIG(*) OVER () -->
	<xsl:template match="OpCountSubqueryRows">
		SUM(CAST(1 AS BIGINT)) OVER ()
	</xsl:template>


	<!-- Binary expressions                                               -->
	<!-- Equal/NotEqual/Greater/GreaterOrEqual/Less/LessOrEqual/In/And/Or/Plus/Minus/Divide/Multiply
	     expressions                                                      -->
	<xsl:template match="Equal|NotEqual|Greater|GreaterOrEqual|Less|LessOrEqual|In|And|Or|Plus|Minus|Divide|Multiply">
		<xsl:variable name="operator">
			<xsl:choose>
				<xsl:when test="name()='Equal'">			=		</xsl:when>
				<xsl:when test="name()='NotEqual'">			&lt;&gt;	</xsl:when>
				<xsl:when test="name()='Greater'">			&gt;		</xsl:when>
				<xsl:when test="name()='GreaterOrEqual'"><![CDATA[	>=		]]></xsl:when>
				<xsl:when test="name()='Less'">				&lt;	</xsl:when>
				<xsl:when test="name()='LessOrEqual'">		&lt;=	</xsl:when>
				<xsl:when test="name()='In'">				IN		</xsl:when>
				<xsl:when test="name()='And'">				AND		</xsl:when>
				<xsl:when test="name()='Or'">				OR		</xsl:when>
				<xsl:when test="name()='Plus'">				+		</xsl:when>
				<xsl:when test="name()='Minus'">			-		</xsl:when>
				<xsl:when test="name()='Divide'">			/		</xsl:when>
				<xsl:when test="name()='Multiply'">			*		</xsl:when>
			</xsl:choose>
		</xsl:variable>
		(
			<xsl:call-template name="print-children-list">
				<xsl:with-param name="operator" select="$operator"/>
			</xsl:call-template>
		)
	</xsl:template>

<!-- Unary string functions	-->

<xsl:template match="OpLower">
  LOWER(<xsl:apply-templates select="./*[1]"/>)
</xsl:template>

<xsl:template match="OpUpper">
  UPPER(<xsl:apply-templates select="./*[1]"/>)
</xsl:template>

<xsl:template match="OpLen">
  LEN(<xsl:apply-templates select="./*[1]"/>)
</xsl:template>

<xsl:template match="OpTrimLeft">
  LTRIM(<xsl:apply-templates select="./*[1]"/>)
</xsl:template>

<xsl:template match="OpTrimRight">
  RTRIM(<xsl:apply-templates select="./*[1]"/>)
</xsl:template>

<xsl:template match="OpTrim">
  RTRIM(LTRIM(<xsl:apply-templates select="./*[1]"/>))
</xsl:template>

	<!--
		Binary expressions where NULL considered as BLANK value(more like 0).
		FUTURE: alleonov: maybe replace prefix Op with something else
	-->
	<!--Comparisons-->
	<xsl:template match="OpGreater|OpLess|OpNotEqual|OpEqual|OpGreaterOrEqual|OpLessOrEqual">
		<xsl:variable name="operator">
			<xsl:choose>
				<xsl:when test="name()='OpGreater'">		&gt;			</xsl:when>
				<xsl:when test="name()='OpLess'">				&lt;			</xsl:when>
				<xsl:when test="name()='OpNotEqual'">		&lt;&gt;	</xsl:when>
				<xsl:when test="name()='OpEqual'">			=					</xsl:when>
				<xsl:when test="name()='OpGreaterOrEqual'">			&gt;=		</xsl:when>
				<xsl:when test="name()='OpLessOrEqual'">				&lt;=	</xsl:when>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="Op1">
			<xsl:choose>
				<xsl:when test="@Op1Nullable = 'false'"> (<xsl:apply-templates select="./*[1]"/>) </xsl:when>
				<xsl:when test="@Op1Type = 'String'"> ISNULL(<xsl:apply-templates select="./*[1]"/>, '') </xsl:when>
				<xsl:when test="@Op1Type = 'Datetime'"> ISNULL(<xsl:apply-templates select="./*[1]"/>, CAST(-2 AS datetime)) </xsl:when>
				<xsl:otherwise> ISNULL(<xsl:apply-templates select="./*[1]"/>, 0) </xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="Op2">
			<xsl:choose>
				<xsl:when test="@Op2Nullable = 'false'"> (<xsl:apply-templates select="./*[2]"/>) </xsl:when>
				<xsl:when test="@Op2Type = 'String'"> ISNULL(<xsl:apply-templates select="./*[2]"/>, '') </xsl:when>
				<xsl:when test="@Op2Type = 'Datetime'"> ISNULL(<xsl:apply-templates select="./*[2]"/>, CAST(-2 AS datetime)) </xsl:when>
				<xsl:otherwise> ISNULL(<xsl:apply-templates select="./*[2]"/>, 0) </xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:value-of select="$Op1"/> <xsl:value-of select="$operator"/> <xsl:value-of select="$Op2"/>
	</xsl:template>

	<!-- OpIs-->
	<xsl:template match="OpIs">
		<xsl:choose>
			<xsl:when test="@Op1Nullable = 'false' or @Op2Nullable = 'false'">
				(<xsl:apply-templates select="./*[1]"/>) = (<xsl:apply-templates select="./*[2]"/>)
			</xsl:when>
			<xsl:when test="@OpsAreColRefs = 'true'">
				<!--It's illegal to repeat query parameters more than once, so we can use only column references here.-->
				(<xsl:apply-templates select="./*[1]"/>) = (<xsl:apply-templates select="./*[2]"/>) OR (<xsl:apply-templates select="./*[1]"/>) IS NULL AND (<xsl:apply-templates select="./*[2]"/>) IS NULL
			</xsl:when>
			<xsl:otherwise>
				<!--Do the same as in "OpsAreColRefs = 'true'" branch, but repeating parameters only once here -> expression is more complicated.-->
				(SELECT CASE WHEN Op1 = Op2 OR Op1 IS NULL AND Op2 IS NULL THEN 1 ELSE 0 END FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 1
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
<!-- OpStrictGreater-->
  <xsl:template match="OpStrictGreater">
    <xsl:variable name="Op1Zero">
      <xsl:choose>
        <xsl:when test="@Op1Type = 'String'">''</xsl:when>
        <xsl:when test="@Op1Type = 'Datetime'">CAST(-2 AS datetime)</xsl:when>
        <xsl:otherwise>0</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="Op2Zero">
      <xsl:choose>
        <xsl:when test="@Op2Type = 'String'">''</xsl:when>
        <xsl:when test="@Op2Type = 'Datetime'">CAST(-2 AS datetime)</xsl:when>
        <xsl:otherwise>0</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="@Op1Nullable = 'false' and @Op2Nullable = 'false'">(<xsl:apply-templates select="./*[1]"/>) &gt; (<xsl:apply-templates select="./*[2]"/>)</xsl:when>
      <xsl:when test="@Op1Nullable = 'false'">(SELECT (CASE WHEN Op2 IS NULL THEN CASE WHEN Op1 &gt;= <xsl:value-of select="$Op1Zero"/> THEN 1 ELSE 0 END ELSE CASE WHEN Op1 &gt; Op2 THEN 1 ELSE 0 END END)  FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 1</xsl:when>
      <xsl:when test="@Op2Nullable = 'false'">(SELECT (CASE WHEN Op1 IS NULL THEN CASE WHEN Op2 &lt; <xsl:value-of select="$Op2Zero"/> THEN 1 ELSE 0 END ELSE CASE WHEN Op1 &gt; Op2 THEN 1 ELSE 0 END END)  FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 1</xsl:when>
      <xsl:otherwise>(SELECT (CASE WHEN Op1 IS NULL THEN CASE WHEN Op2 &lt; <xsl:value-of select="$Op2Zero"/> THEN 1 ELSE 0 END ELSE CASE WHEN Op2 IS NULL THEN CASE WHEN Op1 &gt;= <xsl:value-of select="$Op1Zero"/> THEN 1 ELSE 0 END ELSE CASE WHEN Op1 &gt; Op2 THEN 1 ELSE 0 END END END)  FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 1</xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <!-- OpStrictLess-->
  <xsl:template match="OpStrictLess">
    <xsl:variable name="Op1Zero">
      <xsl:choose>
        <xsl:when test="@Op1Type = 'String'">''</xsl:when>
        <xsl:when test="@Op1Type = 'Datetime'">CAST(-2 AS datetime)</xsl:when>
        <xsl:otherwise>0</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="Op2Zero">
      <xsl:choose>
        <xsl:when test="@Op2Type = 'String'">''</xsl:when>
        <xsl:when test="@Op2Type = 'Datetime'">CAST(-2 AS datetime)</xsl:when>
        <xsl:otherwise>0</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="@Op1Nullable = 'false' and @Op2Nullable = 'false'">(<xsl:apply-templates select="./*[1]"/>) &lt; (<xsl:apply-templates select="./*[2]"/>)</xsl:when>
      <xsl:when test="@Op1Nullable = 'false'">(SELECT (CASE WHEN Op2 IS NULL THEN CASE WHEN Op1 &lt; <xsl:value-of select="$Op1Zero"/> THEN 1 ELSE 0 END ELSE CASE WHEN Op1 &lt; Op2 THEN 1 ELSE 0 END END)  FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 1</xsl:when>
      <xsl:when test="@Op2Nullable = 'false'">(SELECT (CASE WHEN Op1 IS NULL THEN CASE WHEN Op2 &gt;= <xsl:value-of select="$Op2Zero"/> THEN 1 ELSE 0 END ELSE CASE WHEN Op1 &lt; Op2 THEN 1 ELSE 0 END END)  FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 1</xsl:when>
      <xsl:otherwise>(SELECT (CASE WHEN Op2 IS NULL THEN CASE WHEN Op1 &lt; <xsl:value-of select="$Op1Zero"/> THEN 1 ELSE 0 END ELSE CASE WHEN Op1 IS NULL THEN CASE WHEN Op2 &gt;= <xsl:value-of select="$Op2Zero"/> THEN 1 ELSE 0 END ELSE CASE WHEN Op1 &lt; Op2 THEN 1 ELSE 0 END END END)  FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 1</xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <!-- OpStrictLessOrEqual-->
  <xsl:template match="OpStrictLessOrEqual">
    <xsl:variable name="Op1Zero">
      <xsl:choose>
        <xsl:when test="@Op1Type = 'String'">''</xsl:when>
        <xsl:when test="@Op1Type = 'Datetime'">CAST(-2 AS datetime)</xsl:when>
        <xsl:otherwise>0</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="Op2Zero">
      <xsl:choose>
        <xsl:when test="@Op2Type = 'String'">''</xsl:when>
        <xsl:when test="@Op2Type = 'Datetime'">CAST(-2 AS datetime)</xsl:when>
        <xsl:otherwise>0</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="@Op1Nullable = 'false' and @Op2Nullable = 'false'">(<xsl:apply-templates select="./*[1]"/>) &lt;= (<xsl:apply-templates select="./*[2]"/>)</xsl:when>
      <xsl:when test="@Op1Nullable = 'false'">(SELECT (CASE WHEN Op2 IS NULL THEN CASE WHEN Op1 &gt;= <xsl:value-of select="$Op1Zero"/> THEN 1 ELSE 0 END ELSE CASE WHEN Op1 &gt; Op2 THEN 1 ELSE 0 END END)  FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 0</xsl:when>
      <xsl:when test="@Op2Nullable = 'false'">(SELECT (CASE WHEN Op1 IS NULL THEN CASE WHEN Op2 &lt; <xsl:value-of select="$Op2Zero"/> THEN 1 ELSE 0 END ELSE CASE WHEN Op1 &gt; Op2 THEN 1 ELSE 0 END END)  FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 0</xsl:when>
      <xsl:otherwise>(SELECT (CASE WHEN Op1 IS NULL THEN CASE WHEN Op2 &lt; <xsl:value-of select="$Op2Zero"/> THEN 1 ELSE 0 END ELSE CASE WHEN Op2 IS NULL THEN CASE WHEN Op1 &gt;= <xsl:value-of select="$Op1Zero"/> THEN 1 ELSE 0 END ELSE CASE WHEN Op1 &gt; Op2 THEN 1 ELSE 0 END END END)  FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 0</xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <!-- OpStrictGreaterOrEqual-->
  <xsl:template match="OpStrictGreaterOrEqual">
    <xsl:variable name="Op1Zero">
      <xsl:choose>
        <xsl:when test="@Op1Type = 'String'">''</xsl:when>
        <xsl:when test="@Op1Type = 'Datetime'">CAST(-2 AS datetime)</xsl:when>
        <xsl:otherwise>0</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="Op2Zero">
      <xsl:choose>
        <xsl:when test="@Op2Type = 'String'">''</xsl:when>
        <xsl:when test="@Op2Type = 'Datetime'">CAST(-2 AS datetime)</xsl:when>
        <xsl:otherwise>0</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="@Op1Nullable = 'false' and @Op2Nullable = 'false'">(<xsl:apply-templates select="./*[1]"/>) &gt;= (<xsl:apply-templates select="./*[2]"/>)</xsl:when>
      <xsl:when test="@Op1Nullable = 'false'">(SELECT (CASE WHEN Op2 IS NULL THEN CASE WHEN Op1 &lt; <xsl:value-of select="$Op1Zero"/> THEN 1 ELSE 0 END ELSE CASE WHEN Op1 &lt; Op2 THEN 1 ELSE 0 END END)  FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 0</xsl:when>
      <xsl:when test="@Op2Nullable = 'false'">(SELECT (CASE WHEN Op1 IS NULL THEN CASE WHEN Op2 &gt;= <xsl:value-of select="$Op2Zero"/> THEN 1 ELSE 0 END ELSE CASE WHEN Op1 &lt; Op2 THEN 1 ELSE 0 END END)  FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 0</xsl:when>      
      <xsl:otherwise>(SELECT (CASE WHEN Op2 IS NULL THEN CASE WHEN Op1 &lt; <xsl:value-of select="$Op1Zero"/> THEN 1 ELSE 0 END ELSE CASE WHEN Op1 IS NULL THEN CASE WHEN Op2 &gt;= <xsl:value-of select="$Op2Zero"/> THEN 1 ELSE 0 END ELSE CASE WHEN Op1 &lt; Op2 THEN 1 ELSE 0 END END END)  FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 0</xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <!-- OpStrictNotEqual-->
  <xsl:template match="OpStrictNotEqual">
    <xsl:variable name="Op1Zero">
      <xsl:choose>
        <xsl:when test="@Op1Type = 'String'">''</xsl:when>
        <xsl:when test="@Op1Type = 'Datetime'">CAST(-2 AS datetime)</xsl:when>
        <xsl:otherwise>0</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="Op2Zero">
      <xsl:choose>
        <xsl:when test="@Op2Type = 'String'">''</xsl:when>
        <xsl:when test="@Op2Type = 'Datetime'">CAST(-2 AS datetime)</xsl:when>
        <xsl:otherwise>0</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="@Op1Nullable = 'false' and @Op2Nullable = 'false'">(<xsl:apply-templates select="./*[1]"/>) &lt;&gt; (<xsl:apply-templates select="./*[2]"/>)</xsl:when>
      <xsl:when test="@Op1Nullable = 'false'">(SELECT CASE WHEN Op2 IS NULL THEN 0 ELSE CASE WHEN Op1 = Op2 THEN 1 ELSE 0 END END FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 0</xsl:when>
      <xsl:when test="@Op2Nullable = 'false'">(SELECT CASE WHEN Op1 IS NULL THEN 0 ELSE CASE WHEN Op1 = Op2 THEN 1 ELSE 0 END END FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 0</xsl:when>                  
      <xsl:otherwise>(SELECT CASE WHEN Op1 = Op2 OR (Op1 IS NULL AND Op2 IS NULL) THEN 1 ELSE 0 END FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 0</xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <!-- OpStrictEqual-->
  <xsl:template match="OpStrictEqual">
    <xsl:variable name="Op1Zero">
      <xsl:choose>
        <xsl:when test="@Op1Type = 'String'">''</xsl:when>
        <xsl:when test="@Op1Type = 'Datetime'">CAST(-2 AS datetime)</xsl:when>
        <xsl:otherwise>0</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="Op2Zero">
      <xsl:choose>
        <xsl:when test="@Op2Type = 'String'">''</xsl:when>
        <xsl:when test="@Op2Type = 'Datetime'">CAST(-2 AS datetime)</xsl:when>
        <xsl:otherwise>0</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="@Op1Nullable = 'false' and @Op2Nullable = 'false'">(<xsl:apply-templates select="./*[1]"/>) = (<xsl:apply-templates select="./*[2]"/>)</xsl:when>
      <xsl:when test="@Op1Nullable = 'false'">(SELECT CASE WHEN Op2 IS NULL THEN 0 ELSE CASE WHEN Op1 = Op2 THEN 1 ELSE 0 END END FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 1</xsl:when>
      <xsl:when test="@Op2Nullable = 'false'">(SELECT CASE WHEN Op1 IS NULL THEN 0 ELSE CASE WHEN Op1 = Op2 THEN 1 ELSE 0 END END FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 1</xsl:when>            
      <xsl:otherwise>(SELECT CASE WHEN Op1 = Op2 OR (Op1 IS NULL AND Op2 IS NULL) THEN 1 ELSE 0 END FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable) = 1</xsl:otherwise>
    </xsl:choose>
  </xsl:template>

	<!-- OpAdd-->
	<xsl:template match="OpAdd">
		<!--Only either Op1 or Op2 can be present in the queries, not both-->
		<xsl:variable name="Op1">
			<xsl:choose>
				<xsl:when test="@Op1Type = 'Datetime' and @Op2Type = 'Datetime'">
					<xsl:call-template name="OpCast">
						<xsl:with-param name="param-type" select="'Datetime'"/>
						<xsl:with-param name="target-type" select="'Double'"/>
						<xsl:with-param name="value-node" select="./*[1]"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:apply-templates select="./*[1]"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="Op2">
			<xsl:choose>
				<xsl:when test="@Op1Type = 'Datetime' and @Op2Type = 'Datetime'">
					<xsl:call-template name="OpCast">
						<xsl:with-param name="param-type" select="'Datetime'"/>
						<xsl:with-param name="target-type" select="'Double'"/>
						<xsl:with-param name="value-node" select="./*[2]"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:apply-templates select="./*[2]"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="@Op1Nullable = 'false' and @Op2Nullable = 'false'">
				(<xsl:apply-templates select="./*[1]"/>) + (<xsl:value-of select="$Op2"/>)
			</xsl:when>
			<xsl:when test="@Op1Nullable = 'false'">
				(SELECT ISNULL(AuxTable.Op1 + AuxTable.Op2, AuxTable.Op1) FROM (SELECT <xsl:apply-templates select="./*[1]"/> AS Op1, <xsl:value-of select="$Op2"/> AS Op2) as AuxTable)
			</xsl:when>
			<xsl:when test="@Op2Nullable = 'false'">
				(SELECT ISNULL((<xsl:value-of select="$Op1"/>) + AuxTable.Op2, AuxTable.Op2) FROM (SELECT <xsl:apply-templates select="./*[2]"/> AS Op2) as AuxTable)
			</xsl:when>
			<xsl:when test="@Op1Type = 'Datetime' and @Op2Type = 'Datetime'">
				(SELECT COALESCE(AuxTable.Op1 + CAST(AuxTable.Op2 + 2 AS float) , AuxTable.Op1, AuxTable.Op2) FROM (SELECT <xsl:apply-templates select="./*[1]"/> AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) as AuxTable)
			</xsl:when>
			<xsl:otherwise>
				(SELECT COALESCE(AuxTable.Op1 + AuxTable.Op2, AuxTable.Op1, AuxTable.Op2) FROM (SELECT <xsl:apply-templates select="./*[1]"/> AS Op1, <xsl:apply-templates select="./*[2]"/> AS Op2) as AuxTable)
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- OpSubtract																													 -->
	<xsl:template match="OpSubtract">
		<xsl:variable name="Op2">
			<xsl:choose>
				<xsl:when test="@Op2Type = 'Datetime'">
					<xsl:call-template name="OpCast">
						<xsl:with-param name="param-type" select="'Datetime'"/>
						<xsl:with-param name="target-type" select="'Double'"/>
						<xsl:with-param name="value-node" select="./*[2]"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:apply-templates select="./*[2]"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="@Op1Nullable = 'false' and @Op2Nullable = 'false'">
				(<xsl:apply-templates select="./*[1]"/>) - (<xsl:value-of select="$Op2"/>)
			</xsl:when>
			<xsl:when test="@Op1Nullable = 'false'">
				(SELECT ISNULL(AuxTable.Op1 - AuxTable.Op2, AuxTable.Op1) FROM (SELECT <xsl:apply-templates select="./*[1]"/> AS Op1, <xsl:value-of select="$Op2"/> AS Op2) as AuxTable)
			</xsl:when>
			<xsl:when test="@Op2Nullable = 'false'">
				(SELECT ISNULL((<xsl:apply-templates select="./*[1]"/>) - AuxTable.Op2, -AuxTable.Op2) FROM (SELECT <xsl:value-of select="$Op2"/> AS Op2) as AuxTable)
			</xsl:when>
			<xsl:otherwise>
				(SELECT COALESCE(AuxTable.Op1 - AuxTable.Op2, AuxTable.Op1, -AuxTable.Op2) FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, <xsl:value-of select="$Op2"/> AS Op2) as AuxTable)
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- OpDivide																													 -->
	<xsl:template match="OpDivide">
		<xsl:variable name="Op2">
			<xsl:choose>
				<xsl:when test="@Op1Type = 'Currency' and @Op2Type != 'Currency'">
					<xsl:call-template name="OpCast">
						<xsl:with-param name="param-type" select="@Op2Type"/>
						<xsl:with-param name="target-type" select="'Currency'"/>
						<xsl:with-param name="value-node" select="./*[2]"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="OpCast">
						<xsl:with-param name="param-type" select="@Op2Type"/>
						<xsl:with-param name="target-type" select="'Double'"/>
						<xsl:with-param name="value-node" select="./*[2]"/>
					</xsl:call-template>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="@Op2Nullable = 'false'">
				(<xsl:apply-templates select="./*[1]"/>) / (<xsl:value-of select="$Op2"/>)
			</xsl:when>
			<xsl:otherwise>
				(<xsl:apply-templates select="./*[1]"/>) / ISNULL(<xsl:value-of select="$Op2"/>, 0)
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- OpMultiply																													 -->
	<xsl:template match="OpMultiply">
		<xsl:choose>
			<xsl:when test="@Op1Type = 'Currency' and @Op2Type = 'Currency'">
				(<xsl:apply-templates select="./*[1]"/>) *
				(<xsl:call-template name="OpCast">
					<xsl:with-param name="param-type" select="'Currency'"/>
					<xsl:with-param name="target-type" select="'Double'"/>
					<xsl:with-param name="value-node" select="./*[2]"/>
				</xsl:call-template>)
			</xsl:when>
			<xsl:when test="@Op1Type = 'Double' and @Op2Type = 'Currency' or @Op2Type = 'Double' and @Op1Type = 'Currency'">
				<!--FUTURE: RT: it's impossible to use <xsl:call-template name="OpCast"/> here,
						so using direct cast. It gives us desired result here.					-->
				CAST((<xsl:apply-templates select="./*[1]"/>) * (<xsl:apply-templates select="./*[2]"/>) AS money)
			</xsl:when>
			<xsl:otherwise>
				(<xsl:apply-templates select="./*[1]"/>) * (<xsl:apply-templates select="./*[2]"/>)
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- OpSafeDivide																													 -->
	<xsl:template match="OpSafeDivide">
		<!-- ***** This part is from OpDivide above ***** -->
		<xsl:variable name="Op2">
			<xsl:choose>
				<xsl:when test="@Op1Type = 'Currency' and @Op2Type != 'Currency'">
					<xsl:call-template name="OpCast">
						<xsl:with-param name="param-type" select="@Op2Type"/>
						<xsl:with-param name="target-type" select="'Currency'"/>
						<xsl:with-param name="value-node" select="./*[2]"/>
					</xsl:call-template>
				</xsl:when>
				<xsl:otherwise>
					<xsl:call-template name="OpCast">
						<xsl:with-param name="param-type" select="@Op2Type"/>
						<xsl:with-param name="target-type" select="'Double'"/>
						<xsl:with-param name="value-node" select="./*[2]"/>
					</xsl:call-template>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<!-- ***** End of part from OpDivide.       ***** -->
		(SELECT 
			CASE
			WHEN AuxTable.Op1 IS NULL
				THEN NULL
			ELSE
				CASE
				WHEN AuxTable.Op2 IS NULL OR AuxTable.Op2 = 0
					THEN AuxTable.Op3
					ELSE 
						AuxTable.Op1 / AuxTable.Op2
				END
			END
			FROM (SELECT
							(<xsl:apply-templates select="./*[1]"/>) AS Op1, 
							(<xsl:value-of select="$Op2"/>) AS Op2, 
							(<xsl:apply-templates select="./*[3]"/>) AS Op3
					) as AuxTable
		)
	</xsl:template>


	<!-- OpOr|OpAnd																													 -->
	<xsl:template match="OpOr|OpAnd">
	<xsl:variable name="operator">
			<xsl:choose>
				<xsl:when test="name()='OpOr'">		OR	</xsl:when>
				<xsl:when test="name()='OpAnd'">	AND	</xsl:when>
			</xsl:choose>
		</xsl:variable>
	(<xsl:apply-templates select="./*[1]"/>) <xsl:value-of select="$operator"/> (<xsl:apply-templates select="./*[2]"/>)
	</xsl:template>

	<!-- ROUND -->
	<xsl:template match="OpRound">
		<xsl:choose>
			<xsl:when test="@Op2Nullable = 'false'">
				ROUND((<xsl:apply-templates select="./*[1]"/>), (<xsl:apply-templates select="./*[2]"/>))
			</xsl:when>
			<xsl:otherwise>
				ROUND((<xsl:apply-templates select="./*[1]"/>), ISNULL((<xsl:apply-templates select="./*[2]"/>), 0))
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- TRUNC -->
	<xsl:template match="OpTrunc">
		<xsl:choose>
			<xsl:when test="@Op2Nullable = 'false'">
				ROUND((<xsl:apply-templates select="./*[1]"/>), (<xsl:apply-templates select="./*[2]"/>), 1)
			</xsl:when>
			<xsl:otherwise>
				ROUND((<xsl:apply-templates select="./*[1]"/>), ISNULL((<xsl:apply-templates select="./*[2]"/>), 0), 1)
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- MOD -->
	<xsl:template match="OpMod">
		<xsl:choose>
			<xsl:when test="@Op2Nullable = 'false'">
				(SELECT Op1 - Op2 * FLOOR(Op1 / Op2) FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) AS AuxTable)
			</xsl:when>
			<xsl:otherwise>
				(SELECT Op1 - Op2 * FLOOR(Op1 / Op2) FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, ISNULL((<xsl:apply-templates select="./*[2]"/>), 0) AS Op2) AS AuxTable)
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- QUOTIENT -->
	<xsl:template match="OpQuotient">
		<xsl:choose>
			<xsl:when test="@Op2Nullable = 'false'">
				ROUND((<xsl:apply-templates select="./*[1]"/>) / (<xsl:apply-templates select="./*[2]"/>), 0, 1)
			</xsl:when>
			<xsl:otherwise>
				ROUND((<xsl:apply-templates select="./*[1]"/>) / ISNULL((<xsl:apply-templates select="./*[2]"/>), 0), 0, 1)
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- LOG -->
	<xsl:template match="OpLog">
		<xsl:choose>
			<xsl:when test="@Op1Nullable = 'false' and @Op2Nullable = 'false'">
				(LOG(<xsl:apply-templates select="./*[1]"/>) / LOG(<xsl:apply-templates select="./*[2]"/>))
			</xsl:when>
			<xsl:when test="@Op1Nullable = 'false'">
				(LOG(<xsl:apply-templates select="./*[1]"/>) / LOG(ISNULL((<xsl:apply-templates select="./*[2]"/>), 0)))
			</xsl:when>
			<xsl:when test="@Op2Nullable = 'false'">
				(LOG(ISNULL((<xsl:apply-templates select="./*[1]"/>), 0)) / LOG(<xsl:apply-templates select="./*[2]"/>))
			</xsl:when>
			<xsl:otherwise>
				(LOG(ISNULL((<xsl:apply-templates select="./*[1]"/>), 0)) / LOG(ISNULL((<xsl:apply-templates select="./*[2]"/>), 0)))
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- POWER -->
	<xsl:template match="OpPower">
		<xsl:choose>
			<xsl:when test="@Op2Nullable = 'false'">
				POWER((<xsl:apply-templates select="./*[1]"/>), (<xsl:apply-templates select="./*[2]"/>))
			</xsl:when>
			<xsl:otherwise>
				POWER((<xsl:apply-templates select="./*[1]"/>), ISNULL((<xsl:apply-templates select="./*[2]"/>), 0))
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- ISNULL -->
	<xsl:template match="OpIsNull">
		ISNULL((<xsl:apply-templates select="./*[1]"/>), (<xsl:apply-templates select="./*[2]"/>))
	</xsl:template>

	<!-- SimpleMod, when you guarantee that two operands are natural numbers -->
	<!--            Do not handle nulls. Be careful with negative integers. -->
	<xsl:template match="OpSimpleMod">
		(<xsl:apply-templates select="./*[1]"/>) % (<xsl:apply-templates select="./*[2]"/>)
	</xsl:template>

	<!-- OpIntegerDivide -->
	<xsl:template match="OpIntegerDivide">
		<xsl:choose>
			<xsl:when test="@Op1Nullable = 'false' and @Op2Nullable = 'false'">
				((<xsl:apply-templates select="./*[1]"/>) / (<xsl:apply-templates select="./*[2]"/>))
			</xsl:when>
			<xsl:when test="@Op1Nullable = 'false'">
				((<xsl:apply-templates select="./*[1]"/>) / ISNULL((<xsl:apply-templates select="./*[2]"/>), 0))
			</xsl:when>
			<xsl:when test="@Op2Nullable = 'false'">
				(ISNULL((<xsl:apply-templates select="./*[1]"/>), 0) / (<xsl:apply-templates select="./*[2]"/>))
			</xsl:when>
			<xsl:otherwise>
				(ISNULL((<xsl:apply-templates select="./*[1]"/>), 0) / ISNULL((<xsl:apply-templates select="./*[2]"/>), 0))
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- OpMin w/o type casting. See DXScaExpr_MinMax::DoBuildSQLQuery() for how type casting is done. -->
	<xsl:template match="OpMin">
		<xsl:variable name="Op1CompareOperand">
			<xsl:choose>
				<xsl:when test="@Op1Nullable = 'false'"> Op1 </xsl:when>
				<xsl:otherwise> (ISNULL(Op1, 0)) </xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="Op2CompareOperand">
			<xsl:choose>
				<xsl:when test="@Op2Nullable = 'false'"> Op2 </xsl:when>
				<xsl:otherwise> (ISNULL(Op2, 0)) </xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		(SELECT CASE WHEN <xsl:value-of select="$Op1CompareOperand"/> &lt; <xsl:value-of select="$Op2CompareOperand"/> THEN Op1 ELSE Op2 END FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) AS AuxTable)
	</xsl:template>

	<!-- OpMax w/o type casting. See DXScaExpr_MinMax::DoBuildSQLQuery() for how type casting is done. -->
	<xsl:template match="OpMax">
		<xsl:variable name="Op1CompareOperand">
			<xsl:choose>
				<xsl:when test="@Op1Nullable = 'false'"> Op1 </xsl:when>
				<xsl:otherwise> (ISNULL(Op1, 0)) </xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="Op2CompareOperand">
			<xsl:choose>
				<xsl:when test="@Op2Nullable = 'false'"> Op2 </xsl:when>
				<xsl:otherwise> (ISNULL(Op2, 0)) </xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		(SELECT CASE WHEN <xsl:value-of select="$Op1CompareOperand"/> &gt; <xsl:value-of select="$Op2CompareOperand"/> THEN Op1 ELSE Op2 END FROM (SELECT (<xsl:apply-templates select="./*[1]"/>) AS Op1, (<xsl:apply-templates select="./*[2]"/>) AS Op2) AS AuxTable)
	</xsl:template>

	<!--
		Unary expressions where NULL considered as BLANK value(more like 0).
	-->

	<!-- Not																													 -->
	<xsl:template match="Not">
		NOT(<xsl:apply-templates select="./*[1]"/>)
	</xsl:template>

	<!-- OpNot and BitNot																											-->
	<!-- Do not use SQL NOT because we need to handle UNKNOWN in a special way -->
	<xsl:template match="OpNot">
		CAST((CASE WHEN (<xsl:apply-templates select="./*[1]"/>) THEN 0 ELSE 1 END) AS BIT)
	</xsl:template>

	<xsl:template match="BitNot">
		 <xsl:choose>
			 <xsl:when test="@Op1Nullable = 'false'">
				 1 - (<xsl:apply-templates select="./*[1]"/>)
			 </xsl:when>
			 <xsl:otherwise>
				 ISNULL(1 - (<xsl:apply-templates select="./*[1]"/>), 1)
			 </xsl:otherwise>
		 </xsl:choose>
	</xsl:template>

	<!-- UnaryMinus																													 -->
	<xsl:template match="UnaryMinus">
		-(<xsl:apply-templates select="./*[1]"/>)
	</xsl:template>

	<!-- Unary Excel math functions that NULL is a fixed point. -->
	<xsl:template match="OpAbs|OpCeiling|OpFloor|OpSign|OpSqrt|OpSqr">
		<xsl:variable name="OpName">
			<xsl:choose>
				<xsl:when test="name()='OpAbs'">ABS</xsl:when>
				<xsl:when test="name()='OpCeiling'">CEILING</xsl:when>
				<xsl:when test="name()='OpFloor'">FLOOR</xsl:when>
				<xsl:when test="name()='OpSign'">SIGN</xsl:when>
        <xsl:when test="name()='OpSqrt'">SQRT</xsl:when>
        <xsl:when test="name()='OpSqr'">SQUARE</xsl:when>
      </xsl:choose>
		</xsl:variable>
		<xsl:value-of select="$OpName"/>(<xsl:apply-templates select="./*[1]"/>)
	</xsl:template>

	<!-- Unary Excel math functions that NULL is NOT a fixed point. -->
	<xsl:template match="OpExp|OpLn|OpLg">
		<xsl:variable name="OpName">
			<xsl:choose>
				<xsl:when test="name()='OpExp'">EXP</xsl:when>
				<xsl:when test="name()='OpLn'">LOG</xsl:when>
				<xsl:when test="name()='OpLg'">LOG10</xsl:when>
			</xsl:choose>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="@Op1Nullable = 'false'">
				<xsl:value-of select="$OpName"/>(<xsl:apply-templates select="./*[1]"/>)
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$OpName"/>(ISNULL((<xsl:apply-templates select="./*[1]"/>), 0))
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>


	<!-- Count Rows                                                                 -->
	<xsl:template match="OpCount">
		(CASE WHEN COUNT_BIG(<xsl:apply-templates select="./*[1]"/> <xsl:apply-templates select="./*[2]"/>) = 0 THEN NULL ELSE COUNT_BIG(<xsl:apply-templates select="./*[1]"/> <xsl:apply-templates select="./*[2]"/>) END)
	</xsl:template>

  <!-- FUTURE: Avoid the redundant COUNT_BIG(DISTINCT ), either by using a subquery, or doing a projection on the results -->
  <xsl:template match="OpDistinctCount">
		(CASE WHEN (COUNT_BIG(DISTINCT <xsl:apply-templates select="./*[1]"/>) + MAX(CASE WHEN <xsl:apply-templates select="./*[1]"/> IS NULL THEN 1 ELSE 0 END)) = 0 THEN NULL
		ELSE (COUNT_BIG(DISTINCT <xsl:apply-templates select="./*[1]"/>) + MAX(CASE WHEN <xsl:apply-templates select="./*[1]"/> IS NULL THEN 1 ELSE 0 END)) END)
	</xsl:template>

	<!-- FUTURE: Avoid the redundant COUNT_BIG(DISTINCT ), either by using a subquery, or doing a projection on the results -->
	<xsl:template match="OpDistinctCountSkipBlank">
		(CASE WHEN COUNT_BIG(DISTINCT <xsl:apply-templates select="./*[1]"/>) = 0 THEN NULL
		ELSE COUNT_BIG(DISTINCT <xsl:apply-templates select="./*[1]"/>) END)
	</xsl:template>

	<!-- OpDate/OpTime                                                           -->
	<xsl:template match="OpDate|OpTime">
		<xsl:variable name="Op1">
			<xsl:choose>
				<xsl:when test="@Op1Nullable = 'false'">
					(<xsl:apply-templates select="./*[1]"/>)
				</xsl:when>
				<xsl:otherwise>
					ISNULL(<xsl:apply-templates select="./*[1]"/>, 0)
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="Op2">
			<xsl:choose>
				<xsl:when test="@Op2Nullable = 'false'">
					(<xsl:apply-templates select="./*[2]"/>)
				</xsl:when>
				<xsl:otherwise>
					ISNULL(<xsl:apply-templates select="./*[2]"/>, 0)
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="Op3">
			<xsl:choose>
				<xsl:when test="@Op3Nullable = 'false'">
					(<xsl:apply-templates select="./*[3]"/>)
				</xsl:when>
				<xsl:otherwise>
					ISNULL(<xsl:apply-templates select="./*[3]"/>, 0)
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="name()='OpDate'">
				<xsl:choose>
					<xsl:when test="@Op1Nullable = 'false' or @Op2Nullable = 'false' or @Op3Nullable = 'false'">
						DATEADD(mm, ((SELECT CASE WHEN AuxTable.Op1 &lt; 1900 THEN AuxTable.Op1 ELSE AuxTable.Op1 - 1900 END
										FROM (SELECT <xsl:value-of select="$Op1"/> AS Op1) as AuxTable) )*12 + <xsl:value-of select="$Op2"/> - 1, 0) + (<xsl:value-of select="$Op3"/> - 1)
					</xsl:when>
					<xsl:otherwise>
						(SELECT	COALESCE(AuxTable3.Op1 + AuxTable3.Op3, AuxTable3.Op1 - 1, AuxTable3.Op3 - 1) 
							FROM (SELECT COALESCE(DATEADD(MM, AuxTable2.Op1 + AuxTable2.Op2, 0), DATEADD(MM, AuxTable2.Op1 - 1, 0), DATEADD(MM, AuxTable2.Op2, 0)) AS Op1, AuxTable2.Op3 AS Op3
							FROM (SELECT (CASE WHEN AuxTable.Op1 &lt; 1900 THEN AuxTable.Op1 ELSE AuxTable.Op1 - 1900 END)*12 AS Op1, AuxTable.Op2 - 1 AS Op2, AuxTable.Op3 - 1 AS Op3
							FROM (SELECT <xsl:apply-templates select="./*[1]"/> AS Op1, <xsl:apply-templates select="./*[2]"/> AS Op2, <xsl:apply-templates select="./*[3]"/> AS Op3) AS AuxTable) AS AuxTable2) AS AuxTable3)
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="name()='OpTime'">
				<xsl:choose>
					<xsl:when test="@Op1Nullable = 'false' or @Op2Nullable = 'false' or @Op3Nullable = 'false'">
						DATEADD(ss, (<xsl:value-of select="$Op1"/>*3600 + <xsl:value-of select="$Op2"/>*60 + <xsl:value-of select="$Op3"/>)%(3600*24), -2)
					</xsl:when>
					<xsl:otherwise>
						(SELECT	DATEADD(ss, AuxTable2.Op1%(3600*24), -2)
								FROM (SELECT COALESCE(AuxTable.Op1 + AuxTable.Op2 + AuxTable.Op3, AuxTable.Op1 + AuxTable.Op2, AuxTable.Op1 + AuxTable.Op3,
																			AuxTable.Op2 + AuxTable.Op3, AuxTable.Op1, AuxTable.Op2, AuxTable.Op3) AS Op1
									FROM (SELECT (<xsl:apply-templates select="./*[1]"/>)*3600 AS Op1, (<xsl:apply-templates select="./*[2]"/>)*60 AS Op2 , <xsl:apply-templates select="./*[3]"/> AS Op3) AS AuxTable) AS AuxTable2)
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="OpEOMonth|OpEDate">
		<xsl:variable name="Op1">
			<xsl:choose>
				<xsl:when test="@Op1Nullable = 'false'">
					(<xsl:apply-templates select="./*[1]"/>)
				</xsl:when>
				<xsl:otherwise>
					ISNULL(<xsl:apply-templates select="./*[1]"/>, CAST(-2 AS datetime))
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="Op2">
			<xsl:choose>
				<xsl:when test="@Op2Nullable = 'false'">
					(<xsl:apply-templates select="./*[2]"/>)
				</xsl:when>
				<xsl:otherwise>
					ISNULL(<xsl:apply-templates select="./*[2]"/>, 0)
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="name()='OpEOMonth'">
				<xsl:choose>
					<xsl:when test="@Op1Nullable = 'false' or @Op2Nullable = 'false' or @Op3Nullable = 'false'">
						DATEADD(dd, -1, DATEADD(mm, DATEDIFF(m, 0, <xsl:value-of select="$Op1"/>) + 1 + <xsl:value-of select="$Op2"/>, 0))
					</xsl:when>
					<xsl:otherwise>
						(SELECT DATEADD(dd, -1, DATEADD(mm, COALESCE(AuxTable.Op1 + 1 + AuxTable.Op2, AuxTable.Op1 + 1, AuxTable.Op2), 0))
						FROM (SELECT DATEDIFF(m, 0, <xsl:apply-templates select="./*[1]"/>) AS Op1, <xsl:apply-templates select="./*[2]"/> AS Op2) AS AuxTable)
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			<xsl:when test="name()='OpEDate'">
				<xsl:choose>
					<xsl:when test="@Op1Nullable = 'false' or @Op2Nullable = 'false' or @Op3Nullable = 'false'">
						(SELECT DATEADD(mm, AuxTable.Op2, AuxTable.Op1) FROM (SELECT DATEDIFF(dd, 0, <xsl:value-of select="$Op1"/>) AS Op1, <xsl:value-of select="$Op2"/> AS Op2) AS AuxTable)
					</xsl:when>
					<xsl:otherwise>
						(SELECT COALESCE(DATEADD(mm, AuxTable.Op2, AuxTable.Op1), DATEADD(mm, AuxTable.Op2, CAST(-2 AS datetime)), DATEADD(mm, 0, AuxTable.Op1))
						FROM (SELECT DATEDIFF(dd, 0, <xsl:apply-templates select="./*[1]"/>) AS Op1, <xsl:apply-templates select="./*[2]"/> + 0 AS Op2) AS AuxTable)
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="OpWeekday1|OpWeekday2|OpWeekday3">
		<xsl:variable name="Op1">
			<xsl:choose>
				<xsl:when test="@Op1Nullable = 'false'">
					(<xsl:apply-templates select="./*[1]"/>)
				</xsl:when>
				<xsl:otherwise>
					ISNULL(<xsl:apply-templates select="./*[1]"/>, CAST(-2 AS datetime))
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="name()='OpWeekday1'">
				CAST((DATEPART(dw, CAST(<xsl:value-of select="$Op1"/> AS datetime)) + @@DATEFIRST - 1) % 7 + 1 AS bigint)
			</xsl:when>
			<xsl:when test="name()='OpWeekday2'">
				CAST((DATEPART(dw, CAST(<xsl:value-of select="$Op1"/> AS datetime)) + @@DATEFIRST - 2) % 7 + 1 AS bigint)
			</xsl:when>
			<xsl:when test="name()='OpWeekday3'">
				CAST((DATEPART(dw, CAST(<xsl:value-of select="$Op1"/> AS datetime)) + @@DATEFIRST - 2) % 7 AS bigint)
			</xsl:when>
		</xsl:choose>
	</xsl:template>

	<!-- Coalesce                                               -->
	<xsl:template match="Coalesce">
		COALESCE
		(
			<xsl:call-template name="print-children-list"/>
		)
	</xsl:template>

	<!-- Postfix unary expressions                                        -->
	<!-- IsNull
	     expressions                                                      -->
	<xsl:template match="IsNull">
		<xsl:variable name="operator">
			<xsl:choose>
				<xsl:when test="name()='IsNull'">			IS NULL		</xsl:when>
			</xsl:choose>
		</xsl:variable>
		(
			<xsl:apply-templates select="./*[1]"/>
			<xsl:value-of select="$operator"/>
		)
	</xsl:template>

	<!-- Types                                                            -->
	<xsl:template match="Type">
		<xsl:variable name="type-val"><xsl:value-of select="normalize-space(./text())"/></xsl:variable>
		<xsl:choose>
			<xsl:when test="$type-val = 'DBTYPE_BSTR'">    nvarchar     </xsl:when>
			<xsl:when test="$type-val = 'DBTYPE_WSTR'">    nvarchar	    </xsl:when>
			<xsl:when test="$type-val = 'DBTYPE_STR'">     varchar      </xsl:when>
			<xsl:when test="$type-val = 'DBTYPE_BOOL'">    bit          </xsl:when>
			<xsl:when test="$type-val = 'DBTYPE_I1'">      tinyint      </xsl:when>
			<xsl:when test="$type-val = 'DBTYPE_I2'">      smallint     </xsl:when>
			<xsl:when test="$type-val = 'DBTYPE_I4'">      int          </xsl:when>
			<xsl:when test="$type-val = 'DBTYPE_I8'">      bigint       </xsl:when>
			<xsl:when test="$type-val = 'DBTYPE_UI1'">     tinyint      </xsl:when>
			<xsl:when test="$type-val = 'DBTYPE_UI2'">     smallint     </xsl:when>
			<xsl:when test="$type-val = 'DBTYPE_UI4'">     int          </xsl:when>
			<xsl:when test="$type-val = 'DBTYPE_UI8'">     bigint       </xsl:when>
			<xsl:when test="$type-val = 'DBTYPE_R4'">      real         </xsl:when>
			<xsl:when test="$type-val = 'DBTYPE_R8'">      float        </xsl:when>
			<xsl:when test="$type-val = 'DBTYPE_DATE'">    datetime     </xsl:when>
			<xsl:when test="$type-val = 'DBTYPE_DBTIMESTAMP'">    datetime     </xsl:when>
			<xsl:when test="$type-val = 'DBTYPE_CY'">      decimal      </xsl:when>
			<!-- xsl:when test="$type-val = 'DBTYPE_VARIANT'"> sql_variant  </xsl:when -->
			<!-- xsl:when test="$type-val = 'DBTYPE_GUID'"> uniqueidentifier  </xsl:when -->
			<xsl:when test="$type-val = 'DBTYPE_ByteArray'"> varbinary  </xsl:when>
			<xsl:when test="$type-val = 'DBTYPE_DECIMAL'"> decimal      </xsl:when>
		</xsl:choose>
		<xsl:apply-templates select="./Size"/>
		<xsl:apply-templates select="./Precision"/>
		<xsl:apply-templates select="./Scale"/>		
	</xsl:template>


	<!-- True and False                                                       -->
	<xsl:template match="True">
		<xsl:choose>
			<xsl:when test="@SqlBool = 'true'">
				1=1
			</xsl:when>
			<xsl:otherwise>
				CAST(1 AS BIT)
			</xsl:otherwise>
		</xsl:choose>

	</xsl:template>

	<xsl:template match="False">
		<xsl:choose>
			<xsl:when test="@SqlBool = 'true'">
				1=0
			</xsl:when>
			<xsl:otherwise>
				CAST(0 AS BIT)
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>


	<!-- Size (optional)                                                  -->
	<xsl:template match="Size">
	( <xsl:value-of select="./text()"/> )
	</xsl:template>
	
	<!-- Precision (optional)                                                  -->
	<xsl:template match="Precision">
	( <xsl:value-of select="./text()"/>
	</xsl:template>

	<!-- Scale (optional)                                                  -->
	<xsl:template match="Scale">
	, <xsl:value-of select="./text()"/> )
	</xsl:template>
	<!-- Cast                                                             -->
	<xsl:template match="Cast">
		CAST(<xsl:apply-templates select="./*[1]"/> AS <xsl:apply-templates select="./*[2]"/>)
	</xsl:template>

	<!-- OpCast                                                             -->
	<!-- Known types:                                                       -->
	<!--     Double                                                         -->
	<!--     Integer                                                        -->
	<!--     Currency                                                       -->
	<!--     SqlBool                                                        -->
	<!--     SqlBit                                                         -->
	<!--     Datetime                                                       -->
	<!--     String                                                         -->
	<xsl:template name="OpCast" match="OpCast">
		<xsl:param name="param-type" select="@Op1Type"/>
		<xsl:param name="target-type" select="@ResultType"/>
		<xsl:param name="value-node" select="./*[1]"/>
		<xsl:choose>

			<xsl:when test="$target-type = 'Double'">
				<xsl:choose>
					<xsl:when test="$param-type = 'Datetime'">
						CAST((<xsl:apply-templates select="$value-node"/>) + 2 AS float)
					</xsl:when>
					<xsl:when test="$param-type = 'SqlBool'">
						CAST(CASE WHEN <xsl:apply-templates select="$value-node"/> THEN 1 ELSE 0 END AS float)
					</xsl:when>
					<xsl:otherwise>
						CAST(<xsl:apply-templates select="$value-node"/> AS float)
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>

			<xsl:when test="$target-type = 'Integer'">
				<xsl:choose>
					<xsl:when test="$param-type = 'Datetime'">
						(SELECT CAST(AuxTable.Op1 + CASE WHEN AuxTable.Op1 &lt; 0 THEN -0.5 ELSE 0.5 END AS bigint)
						FROM (SELECT CAST(<xsl:apply-templates select="$value-node"/> AS float) + 2 AS Op1) as AuxTable)
					</xsl:when>
					<xsl:when test="$param-type = 'Double' or $param-type = 'Currency'">
						(SELECT CAST(AuxTable.Op1 + CASE WHEN AuxTable.Op1 &lt; 0 THEN -0.5 ELSE 0.5 END AS bigint)
						FROM (SELECT <xsl:apply-templates select="$value-node"/> AS Op1) as AuxTable)
					</xsl:when>
					<xsl:when test="$param-type = 'SqlBool'">
						CAST(CASE WHEN <xsl:apply-templates select="$value-node"/> THEN 1 ELSE 0 END AS bigint)
					</xsl:when>
					<xsl:otherwise>
						CAST(<xsl:apply-templates select="$value-node"/> as bigint)
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>

			<xsl:when test="$target-type = 'Currency'">
				<xsl:choose>
					<xsl:when test="$param-type = 'Datetime'">
						CAST(<xsl:apply-templates select="$value-node"/> AS money) + 2
					</xsl:when>
					<xsl:when test="$param-type = 'SqlBool'">
						CAST(CASE WHEN <xsl:apply-templates select="$value-node"/> THEN 1 ELSE 0 END AS money)
					</xsl:when>
					<xsl:otherwise>
						CAST(<xsl:apply-templates select="$value-node"/> AS money)
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>

			<xsl:when test="$target-type = 'SqlBool'">
				<xsl:choose>
					<xsl:when test="$param-type = 'Datetime'">
						(<xsl:apply-templates select="$value-node"/>) &lt;&gt; CAST(-2 AS datetime)
					</xsl:when>
					<xsl:when test="$param-type = 'SqlBool'">
						<xsl:apply-templates select="$value-node"/>
					</xsl:when>
					<xsl:when test="$param-type = 'String'">
						CAST(<xsl:apply-templates select="$value-node"/> AS bit) = 1
					</xsl:when>
					<xsl:otherwise>
						(<xsl:apply-templates select="$value-node"/>) &lt;&gt; 0
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>

			<xsl:when test="$target-type = 'SqlBit'">
				<xsl:choose>
					<xsl:when test="$param-type = 'Datetime'">
						CAST(CAST(<xsl:apply-templates select="$value-node"/> AS datetime) + 2 AS bit)
					</xsl:when>
					<xsl:when test="$param-type = 'SqlBool'">
						CAST(CASE WHEN <xsl:apply-templates select="$value-node"/> THEN 1 ELSE 0 END AS bit)
					</xsl:when>
					<xsl:otherwise>
						CAST(<xsl:apply-templates select="$value-node"/> AS bit)
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>

			<xsl:when test="$target-type = 'Datetime'">
				<xsl:choose>
					<xsl:when test="$param-type = 'SqlBool'">
						CAST(CASE WHEN <xsl:apply-templates select="$value-node"/> THEN 1 ELSE 0 END AS datetime) - 2
					</xsl:when>
					<xsl:when test="$param-type = 'Double'
										or $param-type = 'Integer'
										or $param-type = 'Currency'
										or $param-type = 'SqlBit'">
						CAST(<xsl:apply-templates select="$value-node"/> AS datetime) - 2
					</xsl:when>
					<xsl:otherwise>
						CAST(<xsl:apply-templates select="$value-node"/> AS datetime)
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>

			<xsl:when test="$target-type = 'String'">
				<xsl:choose>
					<xsl:when test="$param-type = 'SqlBit'">
						CASE WHEN <xsl:apply-templates select="$value-node"/> = 1 THEN N'TRUE' ELSE N'FALSE' END
					</xsl:when>
					<xsl:when test="$param-type = 'SqlBool'">
						CASE WHEN <xsl:apply-templates select="$value-node"/> THEN N'TRUE' ELSE N'FALSE' END 
					</xsl:when>
					<xsl:otherwise>
						CAST(<xsl:apply-templates select="$value-node"/> AS nvarchar(max))
					</xsl:otherwise>
				</xsl:choose>
			</xsl:when>
			
			<xsl:otherwise>
				<xsl:message terminate="yes">SQL90 cartridge error: OpCast: ResultType is not specified</xsl:message>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- OpCase                                                           -->
	<xsl:template match="OpCase">
		CASE
		<xsl:apply-templates select="./Condition"/>
		<xsl:apply-templates select="./Else"/>
		END
	</xsl:template>

	<xsl:template match="Condition">
		WHEN (<xsl:apply-templates select="./*[1]"/>)
		<xsl:apply-templates select="following-sibling::Then[1]"/>
	</xsl:template>

	<xsl:template match="Then">
		THEN (<xsl:apply-templates select="./*[1]"/>)
	</xsl:template>

	<xsl:template match="Else">
		ELSE (<xsl:apply-templates select="./*[1]"/>)
	</xsl:template>

	<!-- OpRank|OpDenseRank|RowNumber|Ntile -->
	<xsl:template match="OpRank|OpDenseRank|OpRowNumber|OpNtile">
		<xsl:variable name="rank_function">
			<xsl:choose>
				<xsl:when test="name()='OpRank'"> RANK() </xsl:when>
				<xsl:when test="name()='OpDenseRank'"> DENSE_RANK() </xsl:when>
				<xsl:when test="name()='OpRowNumber'"> ROW_NUMBER() </xsl:when>
				<xsl:when test="name()='OpNtile'"> NTILE(<xsl:apply-templates select="./*[1]"/>) </xsl:when>
			</xsl:choose>
		</xsl:variable>
		<xsl:value-of select="$rank_function"/>
		OVER
		(
			<xsl:apply-templates select="./PartitionBy"/>
			<xsl:apply-templates select="./OrderBy"/>
		)
	</xsl:template>

	<xsl:template match="PartitionBy">
		PARTITION BY <xsl:call-template name="print-children-list"/>
	</xsl:template>

	<!-- Literal -->
	<xsl:template match="Literal">
		<xsl:value-of select="."/>
	</xsl:template>
	
	<!-- By default don't do anything                                     -->
	<xsl:template match="*">
	</xsl:template>

	<!-- Print a schema object                                               -->
	<xsl:template name="build-quoted-schema-object"> 
		<xsl:param name="schema-object-node" select="."/>

		<xsl:variable name="unquoted-schema">
			<xsl:value-of select="$schema-object-node/Schema"/>
		</xsl:variable>
		<xsl:variable name="schema">
			<xsl:apply-templates select="$schema-object-node/Schema"/>
		</xsl:variable>
		<xsl:variable name="table">
			<xsl:apply-templates select="$schema-object-node/Name"/>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="$unquoted-schema = ''">
				<xsl:value-of select="$table"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="concat($schema,'.', $table)"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- Convert an identifier to the OLEDB quotation form                -->
	<xsl:template name="quote-identifier"> 
		<xsl:param name="identifier" select="."/>

		<xsl:value-of select="$IdentifierStartQuotingCharacter"/>
		<xsl:call-template name="normalize-entity-aux">
			<xsl:with-param name="entity" select="$identifier"/>
			<xsl:with-param name="end-quoting-char" select="$IdentifierEndQuotingCharacter"/>
		</xsl:call-template>
		<xsl:value-of select="$IdentifierEndQuotingCharacter"/>
	</xsl:template>

	<!-- Convert a string to the string quotation form                    -->
	<xsl:template name="quote-string"> 
		<xsl:param name="string" select="."/>

		<xsl:value-of select="$StringStartQuotingCharacter"/>
		<xsl:call-template name="normalize-entity-aux">
			<xsl:with-param name="entity" select="$string"/>
			<xsl:with-param name="end-quoting-char" select="$StringEndQuotingCharacter"/>
		</xsl:call-template>
		<xsl:value-of select="$StringEndQuotingCharacter"/>
	</xsl:template>

	<!-- Convert an entity to the quotation form (recursive, aux)  by
         duplicating the end quoting character                            -->
	<xsl:template name="normalize-entity-aux"> 
		<xsl:param name="entity"/>
		<xsl:param name="end-quoting-char"/>

		<xsl:choose>
			<xsl:when test="contains($entity, $end-quoting-char)">
				<xsl:value-of select="substring-before($entity, $end-quoting-char)"/>
				<xsl:value-of select="$end-quoting-char"/>
				<xsl:value-of select="$end-quoting-char"/>
				<xsl:call-template name="normalize-entity-aux">
					<xsl:with-param name="entity" select="substring-after($entity, $end-quoting-char)"/>
					<xsl:with-param name="end-quoting-char" select="$end-quoting-char"/>
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$entity"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<!-- Print the children list                                          -->
	<xsl:template name="print-children-list">
		<xsl:param name="operator" select="','"/>
		
		<xsl:call-template name="print-list">
			<xsl:with-param name="value-node" select="./*"/>
			<xsl:with-param name="operator" select="$operator"/>
		</xsl:call-template>
	</xsl:template>

	<!-- Print a list                                                     -->
	<xsl:template name="print-list">
		<xsl:param name="operator" select="','"/>
		<xsl:param name="value-node" select="."/>

		<xsl:for-each select="$value-node">
			<xsl:apply-templates select="."/>
			<xsl:if test="position()!=last()">
				<xsl:value-of select="$operator"/>
			</xsl:if>
		</xsl:for-each>
	</xsl:template>

	<!-- Get the value of a parameter ref for the query                   -->
	<xsl:template name="print-non-parametric-parameter-ref">
		<xsl:param name="parameter-reference"/>

		<xsl:variable name="reference"><xsl:value-of select="$parameter-reference/@ref"/></xsl:variable>
		<xsl:call-template name="print-non-parametric-parameter">
			<xsl:with-param name="parameter" select="/Statement/Parameters/Parameter[@id=$reference]"/>
		</xsl:call-template>
	</xsl:template>

	<!-- Get the value of a parameter ref for the query                   -->
	<xsl:template name="print-non-parametric-parameter">
		<xsl:param name="parameter"/>

		<xsl:variable name="db-type"><xsl:value-of select="$parameter/@DBTYPE"/></xsl:variable>
		<xsl:variable name="value"><xsl:value-of select="$parameter/text()"/></xsl:variable>
		<xsl:choose>
			<xsl:when test="$db-type = 'DBTYPE_BSTR'"><xsl:call-template name="quote-string"><xsl:with-param name="string" select="$value"/></xsl:call-template></xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_WSTR'"><xsl:call-template name="quote-string"><xsl:with-param name="string" select="$value"/></xsl:call-template></xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_STR'"><xsl:call-template name="quote-string"><xsl:with-param name="string" select="$value"/></xsl:call-template></xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_BOOL'">CAST(<xsl:value-of select="$value"/> AS bit)</xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_I1'"><xsl:value-of select="$value"/></xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_I2'"><xsl:value-of select="$value"/></xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_I4'"><xsl:value-of select="$value"/></xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_I8'"><xsl:value-of select="$value"/></xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_UI1'"><xsl:value-of select="$value"/></xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_UI2'"><xsl:value-of select="$value"/></xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_UI4'"><xsl:value-of select="$value"/></xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_UI8'"><xsl:value-of select="$value"/></xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_R4'"><xsl:value-of select="$value"/></xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_R8'"><xsl:value-of select="$value"/></xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_DATE'">CAST( <xsl:call-template name="quote-string"><xsl:with-param name="string" select="$value"/></xsl:call-template> AS datetime)</xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_DBTIMESTAMP'">CAST( <xsl:call-template name="quote-string"><xsl:with-param name="string" select="$value"/></xsl:call-template> AS datetime)</xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_CY'">CAST( <xsl:call-template name="quote-string"><xsl:with-param name="string" select="$value"/></xsl:call-template> AS decimal)</xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_VARIANT'"><xsl:call-template name="quote-string"><xsl:with-param name="string" select="$value"/></xsl:call-template></xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_GUID'"><xsl:call-template name="quote-string"><xsl:with-param name="string" select="$value"/></xsl:call-template></xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_ByteArray'"><xsl:call-template name="quote-string"><xsl:with-param name="string" select="$value"/></xsl:call-template></xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_DECIMAL'"><xsl:value-of select="$value"/></xsl:when>
			<xsl:when test="$db-type = 'DBTYPE_EMPTY'">NULL</xsl:when>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
